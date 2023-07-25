from cryptography.hazmat.backends import default_backend
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding, rsa
from cryptography.exceptions import InvalidSignature

import hashlib
import datetime

DEFAULT_ENCODING = "utf-8"


def slicy(string, chunks_count=8):
	chunk_size = len(string) // chunks_count
	return [string[i:i + chunk_size] for i in range(0, len(string), chunk_size)]


def license_generate(user_full_name, user_email, description = "Single User License"):
	now = datetime.datetime.utcnow().timestamp()
	license = hashlib.sha256(
		f"{user_full_name}-{user_email}-{now}".encode()
	).hexdigest()
	return license


def license_format(license, user_full_name, user_email, description="Single User License"):
	license_body = slicy(license, 4)
	license_body = "\n".join([' '.join(slicy(l, 8)) for l in license_body])
	license_b = "---- BEGIN LICENSE ----"
	license_e = "----- END LICENSE -----"
	# return f"{license_b}\n{user_email}\n{user_full_name}\n{description}\n{license_body}\n{license_b}"
	return f"{license_b}\n{license_body}\n{license_e}"


def license_read(license):
	license_data = license.split("\n")
	# license_b, user_email, user_full_name, description, *body, license_e = license_data
	license_b, *body, license_e = license_data
	license_body = "".join("".join(body).split(" "))
	return license_body


def load_public_key_from_string(PUBLIC_KEY):
	return serialization.load_pem_public_key(
		bytes(f"-----BEGIN PUBLIC KEY-----\n{PUBLIC_KEY}\n-----END PUBLIC KEY-----", DEFAULT_ENCODING),
		backend=default_backend()
	)


def load_private_key_from_string(PRIVATE_KEY):
	return serialization.load_pem_private_key(
		bytes(f"-----BEGIN ENCRYPTED PRIVATE KEY-----\n{PRIVATE_KEY}\n-----END ENCRYPTED PRIVATE KEY-----", DEFAULT_ENCODING),
		password=b'mypassword',
		backend=default_backend()
	)

# priv = "MIIFLTBXBgkqhkiG9w0BBQ0wSjApBgkqhkiG9w0BBQwwHAQIFyFupaGgxeUCAggAMAwGCCqGSIb3DQIJBQAwHQYJYIZIAWUDBAEqBBArLamCABq66+37hEufIzErBIIE0Kyw25xw9LfdpvBhidxniFX6lKrDc25Z4yw3GZn25chjXmPoej0+YV+8atxu2aJ5l9k2tFWEbcgEedQIA5drMwvK48G2L1ioKlxdgZ5OSlCUMqBCpLHz1SVm8U6H9HIZAPMBVkF+P1FlVqRVqxmYeLRe2bvTDA52OTJSlmuKPoxR2SAUc7YY9IuNRujxfHXFtnQ7+Ce+Jo3etXTc0GA9LUYLtb7RJkK/Z5tMT7/byR+1qBSgZ2AhjEQQlmdfYINsFGBacf0SDKA0YO658L29AmpOKu28MhMUjZDjFLSnExAFQqEkewMeUNPeZbAeORgAwKyPokH7znYq6O9sRVhafNkTbSHQruSaDcbMFSkmohF9vlUj3JCVKdBvfBFEMa0hLB68wkPA+9Jvw0TKvtR7DPEfvy7icOgAmgsotowoNCya2QJznvh7FGNGzF022/G6z9D3Ze3HD3jyzG5SvacX1gyNUzGw4wwCAwUydDUGKs/BLtHWIrhBR+vhTHPt39mbK2plOIFErdjCA/gevGMIQ0zJRvWx3ne6VmlV/RY1hKui5gToeRAObko6/gl1NXu1ugF20Xv+8eOBcTUDPh+lfGUaQumHI8Dr89vSRBTLDuSW0wiasOHvQb2U/wMJkCuccv85Z85k1e+jvsGnE52Z3F95Z+KKEGagISt3aApVZLSjWNCAkSZjD3O6KIvzV5O2ufE2iwcYlTtRYqtJk+KHQCFoYUD9BBciF1N4wQfUt3N2JGqatESCnRPBPuDpO+KL6ZTXTm9EmAeAxMqL0+1N8KLJpoyvJJTszMqXYQZfHMpDkwi+N8eVoNjnWYwdCk+ha7je5MgwDySkKyu6xMNKsY61iGyTXec2pMJe7QkkZjYqNbgeR2S3M9hp/W1vCfNf1lWuwFo+dkCt6pR2AS1KX2rtLMoEj52/KKhKI2cXbsUfJX4Yu0cgn1W8prMOKZjpnmcj6UakZPV78Rdxj2+uA0LsuoUTHSjCaAVf5C9AjiwBS6bXjttpYFARl+Gem9IPPo8gv5ycpJ8/EhABtavyKXGSghDlvELWRs34h/Pa7+CMttD3/58sl2Of34Dri+rVKgraO2DakSLaCw+Hrej33AD8y8z4f9WzodF5xJu4Nb8gC39QSP9t0rETzMsBXXSKihYGVwgs9C7lvpTlEtMBbfuqcCU8xMlOqtZOtEqHhHpwsgZO9EBK6gHdirYEdFmLM2NHECFg1XoGkA5jyVE7Bu8YURgRMHO2tVsryp5hunOy5WUzMFfaZFDu+Y96l7a4hQ08e0qNehAy2tsi3afJHx2M8xQvaYxfkPHbNSZrZHyfn9I9FAo+iIm6p0O0HGc4yebtfoVS2/I/nKNfJ12zpT8DY3hJ0XoHGrGzNi47d4uKINP7ZQVqZCVejQA/mt9PfZO/PvmpUtSOZWMYaTuVgm1AnUiB0UZAn/1Vxu62A2PfSaH8C8JvYJNuSjMxyClX9GFFo4Z5GEVCKNWBU+qomyjq7YrKVQFHj9h+UUYADub4r7/T6Cx92VFjFKClwVG70/JVJ8YpHghGt+M1eBj2aTB2srwqaYNEi0bkAQQBDQAo37daLe1cjcb51t3V5LnRwwwqiPNWdOyBy9aEOqnTZufQZUg8NxZ8KhUiLxtVOLiU"
# pub = "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0qAJo7tzICy6rsO+thH92V/erM65opxy5roBuL4Kc5WfVzS373yg5G00CNMbv6wtA7q5yP3CgMHqub2dosr36V4d3JwLlXcUTALKK9DpEEzzGvVtce/2u0Ftw1xLLuBgwCk09czz4gIVwpdSEizkSbXKYVmqJIco2vkLn6jxNs3fKl4PtsmeW0gYQ6UFrOOfnmocWeFb79qfb+MyAGJF16151wU83b99LLlv5TfPhORlogDZ7yp7v8NT+ffImflvIWXgtZNtL7QKXf/WBpvHpF4AJm/gxII8tdfDUbjjLlicobytDkEE9CMGLMit/aVlT6y7ALlclVwOu6P5JdDd2wIDAQAB"


# private_key = load_private_key_from_string(priv)
# public_key = load_public_key_from_string(pub)


def encrypt_by_public(message, public_key):
	return public_key.encrypt(
		bytes(message, DEFAULT_ENCODING),
		padding.OAEP(
			mgf=padding.MGF1(algorithm=hashes.SHA256()),
			algorithm=hashes.SHA256(),
			label=None
		)
	)


def sign_message(message, private_key):
	return private_key.sign(
		bytes(message, DEFAULT_ENCODING),
		padding.PSS(
			mgf=padding.MGF1(hashes.SHA256()),
			salt_length=padding.PSS.MAX_LENGTH
		),
		hashes.SHA256()
	)


def verify_message(message, signature, public_key):
	try:
		public_key.verify(
			signature,
			bytes(message, DEFAULT_ENCODING),
			padding.PSS(
				mgf=padding.MGF1(hashes.SHA256()),
				salt_length=padding.PSS.MAX_LENGTH
			),
			hashes.SHA256()
		)
		return True
	except InvalidSignature:
		return False


def decrypt_by_private(encrypted_message, private_key):
	return private_key.decrypt(
		encrypted_message,
		padding.OAEP(
			mgf=padding.MGF1(algorithm=hashes.SHA256()),
			algorithm=hashes.SHA256(),
			label=None
		)
	).decode()


# # server
# message = "Hello"
# signature = sign_message(message, private_key)
# # >>> server send [message, signature, public_key] to client

# # client
# # >>> receive [message, signature, public_key] from server
# verified = verify_message(message, signature, public_key)
# print(verified)


# enc_msg = encrypt_by_public(message, public_key)
# print(enc_msg)
# dec_msg = decrypt_by_private(enc_msg, private_key)
# print(dec_msg)


def key_bytes_to_string(key_bytes):
	return "".join(key_bytes.decode().splitlines()[1:-1])


def generate_key_private():
	private_key = rsa.generate_private_key(
		public_exponent=65537,
		# key_size=2048,
		key_size=512,
		backend=default_backend()
	)
	return private_key


def generate_key_private_string():
	private_key = generate_key_private()
	return key_bytes_to_string(
		private_key_to_bytes(
			private_key
		)
	)


def generate_key_public_string(private_key):
	public_key = private_key.public_key()
	return key_bytes_to_string(
		public_key_to_bytes(
			public_key
		)
	)


def generate_key_pair():
	private_key = generate_key_private()
	public_key = private_key.public_key()
	return private_key, public_key


PAIR_ENCODING = serialization.Encoding.PEM


def private_key_to_bytes(private_key):
	return private_key.private_bytes(
		encoding=PAIR_ENCODING,
		format=serialization.PrivateFormat.PKCS8,
		encryption_algorithm=serialization.BestAvailableEncryption(b'mypassword')
	)


def public_key_to_bytes(public_key):
	return public_key.public_bytes(
		encoding=PAIR_ENCODING,
		format=serialization.PublicFormat.SubjectPublicKeyInfo
	)


def generate_key_pair_strings():
	private_key, public_key = generate_key_pair()

	private_key_bytes = private_key_to_bytes(private_key)
	public_key_bytes = public_key_to_bytes(public_key)

	private_key_string = key_bytes_to_string(private_key_bytes)
	public_key_string = key_bytes_to_string(public_key_bytes)

	return (private_key_string, public_key_string)


def check_key_pair(private_key, public_key):
	public_key_string = key_bytes_to_string(public_key_to_bytes(public_key))
	ppublic_key_string = key_bytes_to_string(public_key_to_bytes(private_key.public_key()))
	return public_key_string == ppublic_key_string


def check_key_pair_string(private_key_string, public_key_string):
	try:
		private_key = load_private_key_from_string(private_key_string)
		public_key = load_public_key_from_string(public_key_string)
		return check_key_pair(private_key, public_key)
	except Exception:
		return False
	return False
