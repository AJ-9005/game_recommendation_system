import numpy as np
from typing import List, Dict, Any
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
            self.rawg_id_to_index[game["rawg_id"]] = idx
            
            # Fallback to title/genres if feature_text is missing
            f_text = game.get("feature_text")
            if not f_text:
                genres = " ".join(game.get("genres", []))
                tags = " ".join(game.get("tags", []))
                f_text = f"{game.get('title', '')} {genres} {tags}".lower()
            
            corpus.append(f_text)

        # Build TF-IDF Matrix
        self.tfidf_matrix = self.vectorizer.fit_transform(corpus)

    def recommend_similar_games(self, rawg_id: int, top_n: int = 10, exclude_ids: set[int] = None) -> List[Dict[str, Any]]:
        """
        Calculates cosine similarity for a target game and returns top_n matches.
        """
        if self.tfidf_matrix is None or rawg_id not in self.rawg_id_to_index:
            return []

        if exclude_ids is not None:
            exclude_ids = set()

        exclude_ids.add(rawg_id)

        target_idx = self.rawg_id_to_index[rawg_id]
        target_vector = self.tfidf_matrix[target_idx]

        # Compute cosine similarity against all game vectors
        similarity_scores = cosine_similarity(target_vector, self.tfidf_matrix).flatten()

        # Get top indices (excluding the game itself)
        related_indices = similarity_scores.argsort()[::-1]
        
        recommended_games = []
        for idx in related_indices:
            if idx == target_idx:
                continue
            
            game_doc = dict(self.games_list[idx])

            if game_doc["rawg_id"] in exclude_ids:
                continue

            game_doc["_id"] = str(game_doc["_id"])
            game_doc["similarity_score"] = float(similarity_scores[idx])
            recommended_games.append(game_doc)

            if len(recommended_games) >= top_n:
                break

        return recommended_games

# Global singleton instance
recommender = ContentRecommender()