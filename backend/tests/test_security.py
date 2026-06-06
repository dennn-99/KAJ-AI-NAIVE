from app.core.security import create_access_token, decode_access_token, hash_password, verify_password


def test_password_hash_and_verify() -> None:
    hashed = hash_password("password123")
    assert verify_password("password123", hashed)
    assert not verify_password("wrong-password", hashed)


def test_jwt_round_trip() -> None:
    token = create_access_token("user@example.com")
    assert decode_access_token(token) == "user@example.com"
