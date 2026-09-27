import os, logging
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()
logger = logging.getLogger(__name__)

mongo_uri = os.getenv("MONGO_URI")
client = AsyncIOMotorClient(mongo_uri)
db = client.game_recc_system

async def init_indexes():
    try:
        await db.games.create_index("rawg_id", unique=True)
        await db.games.create_index([("title", "text"), ("genres", "text"), ("tags", "text")])
        logger.info("Mongodb indexes created succesfully")
    except Exception as e:
        logger.warning(f"Index creation warning: {str(e)}")