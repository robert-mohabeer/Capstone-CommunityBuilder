"""CommunityBuilder development configuration."""


import pathlib


# Root of this application, useful if it doesn't occupy an entire domain
APPLICATION_ROOT = '/'


# Secret key for encrypting cookies
SECRET_KEY = b'?\x16\xfe\xc5n\xbey\x10\xb5\x0c\x96D'\
    b'\xff\x9e\xd1\x99\x93\xfa\xe6\x80\xed\x93*\xd1'
SESSION_COOKIE_NAME = 'login'


# File Upload to var/uploads/
COMMUNITYBUILDER_ROOT = pathlib.Path(__file__).resolve().parent.parent
UPLOAD_FOLDER = COMMUNITYBUILDER_ROOT/'var'/'uploads'
ALLOWED_EXTENSIONS = set(['png', 'jpg', 'jpeg', 'gif'])
MAX_CONTENT_LENGTH = 16 * 1024 * 1024


# Database file is var/CommunityBuilder.sqlite3
DATABASE_FILENAME = COMMUNITYBUILDER_ROOT/'var'/'CommunityBuilder.sqlite3'
