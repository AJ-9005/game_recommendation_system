from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

password_hasher = PasswordHash((Argon2Hasher(),))

def encrypt_password(password: str) -> str:
    return password_hasher.hash(password)
def verify_password(entered_password: str, stored_password: str) -> str:
    return password_hasher.verify(entered_password, stored_password)