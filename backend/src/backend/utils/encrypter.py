from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def encrypt_password(password: str) -> str:
    return pwd_context.hash(password)
def verify_password(entered_password: str, stored_password: str) -> str:
    return pwd_context.verify(entered_password, stored_password)