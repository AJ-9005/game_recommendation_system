import numpy as np
from typing import List, Dict, Any, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from backend.connect import db

class ContentRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words="english")
        self.tfidf_matrix = None
        self.games_list: List[Dict[str, Any]] = []
        self.rawg_id_to_index: Dict[int, int] = {}

    async def fit(self):
        """
        Loads all cached games from MongoDB, extracts feature_text,
        and constructs the TF-IDF feature matrix.
        """
        cursor = db.games.find({})
        self.games_list = await cursor.to_list(length=None)

        if not self.games_list:
            return

        corpus = []
        self.rawg_id_to_index.clear()

        for idx, game in enumerate(self.games_list):
            rawg_id = game.get("rawg_id")
            if rawg_id is not None:
                try:
                    # Enforce integer key type in rawg_id_to_index
                    self.rawg_id_to_index[int(rawg_id)] = idx
                except (ValueError, TypeError):
                    self.rawg_id_to_index[rawg_id] = idx
            
            # Fallback to title/genres/tags if feature_text is missing
            f_text = game.get("feature_text")
            if not f_text:
                genres = " ".join(game.get("genres", []))
                tags = " ".join(game.get("tags", []))
                f_text = f"{game.get('title', '')} {genres} {tags}".lower()
            
            corpus.append(f_text)

        # Build TF-IDF Matrix
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)

    def recommend_similar_games(self, rawg_id: Any, top_n: int = 10, exclude_ids: Optional[set] = None) -> List[Dict[str, Any]]:
        """
        Calculates cosine similarity for a target game and returns top_n matches.
        """
        if self.tfidf_matrix is None or not self.rawg_id_to_index:
            return []

        # Convert input rawg_id to integer lookup
        try:
            lookup_id = int(rawg_id)
        except (ValueError, TypeError):
            lookup_id = rawg_id

        # Look up target index
        target_idx = self.rawg_id_to_index.get(lookup_id)
        
        # Fallback check if it was stored as string
        if target_idx is None:
            target_idx = self.rawg_id_to_index.get(str(rawg_id))

        if target_idx is None:
            print(f"DEBUG: rawg_id {rawg_id} ({type(rawg_id)}) not found in rawg_id_to_index!")
            return []

        # Build safety exclusion set without mutating caller's set
        exclude_set = set()
        if exclude_ids is not None:
            for item in exclude_ids:
                exclude_set.add(item)
                try:
                    exclude_set.add(int(item))
                except (ValueError, TypeError):
                    pass
                exclude_set.add(str(item))

        # Always exclude target game itself
        exclude_set.add(lookup_id)
        exclude_set.add(str(rawg_id))

        target_vector = self.tfidf_matrix[target_idx]

        # Compute cosine similarity
        similarity_scores = cosine_similarity(target_vector, self.tfidf_matrix).flatten()

        # Sort indices by highest score
        related_indices = similarity_scores.argsort()[::-1]
        
        recommended_games = []
        for idx in related_indices:
            if idx == target_idx:
                continue
            
            game_doc = dict(self.games_list[idx])

            # Check exclusion using both string and int checks
            g_rawg_id = game_doc.get("rawg_id")
            if g_rawg_id in exclude_set or str(g_rawg_id) in exclude_set:
                continue

            game_doc["_id"] = str(game_doc["_id"])
            game_doc["similarity_score"] = float(similarity_scores[idx])
            recommended_games.append(game_doc)

            if len(recommended_games) >= top_n:
                break

        return recommended_games

# Global singleton instance
recommender = ContentRecommender()