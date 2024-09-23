PRAGMA foreign_keys = ON;

CREATE TABLE users (
  username VARCHAR(20) NOT NULL, 
  fullname VARCHAR(40) NOT NULL, 
  email VARCHAR(40) NOT NULL, 
  filename VARCHAR(64), 
  password VARCHAR(256) NOT NULL, 
  age INTEGER,
  about_me VARCHAR(1024),
  PRIMARY KEY(username)
);

CREATE TABLE interests (
	interestid INTEGER PRIMARY KEY AUTOINCREMENT, 
	interest VARCHAR(20) NOT NULL, 
	username VARCHAR(20) NOT NULL, 
	FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE
); 

CREATE TABLE events (
	eventid INTEGER PRIMARY KEY AUTOINCREMENT, 
	title VARCHAR(64) NOT NULL,
    description VARCHAR(1024) NOT NULL, 
	owner VARCHAR(20) NOT NULL,
	date VARCHAR(64) NOT NULL, 
	location VARCHAR(64) NOT NULL,
	address VARCHAR(128) NOT NULL, 
	time VARCHAR(64) NOT NULL,
    mapcoord1 FLOAT,
    mapcoord2 FLOAT,
	FOREIGN KEY (owner) REFERENCES users(username) ON DELETE CASCADE
); 


CREATE TABLE event_labels (
	labelid INTEGER PRIMARY KEY AUTOINCREMENT, 
	eventid INTEGER NOT NULL, 
	label VARCHAR(20) NOT NULL,
	FOREIGN KEY (eventid) REFERENCES events(eventid) ON DELETE CASCADE
); 

CREATE TABLE comments (
	commentid INTEGER PRIMARY KEY AUTOINCREMENT, 
	owner VARCHAR(20) NOT NULL, 
	eventid INTEGER NOT NULL, 
	text VARCHAR(1024) NOT NULL,
	FOREIGN KEY (owner) REFERENCES users(username) ON DELETE CASCADE, 
	FOREIGN KEY (eventid) REFERENCES events(eventid) ON DELETE CASCADE
); 

CREATE TABLE rsvps (
	rsvpid INTEGER PRIMARY KEY AUTOINCREMENT, 
	owner VARCHAR(20) NOT NULL, 
	eventid INTEGER NOT NULL, 
	FOREIGN KEY (owner) REFERENCES users(username)ON DELETE CASCADE, 
	FOREIGN KEY (eventid) REFERENCES events(eventid) ON DELETE CASCADE
); 

-- CREATE TABLE map_coords (
-- 	mapcoordid INTEGER PRIMARY KEY AUTOINCREMENT, 
-- 	owner VARCHAR(20) NOT NULL, 
-- 	eventid INTEGER NOT NULL, 
--     mapcoord1 FLOAT,
--     mapcoord2 FLOAT,
-- 	FOREIGN KEY (owner) REFERENCES users(username)ON DELETE CASCADE, 
-- 	FOREIGN KEY (eventid) REFERENCES events(eventid) ON DELETE CASCADE
-- ); 
CREATE TABLE event_coords (
	event_coords_id INTEGER PRIMARY KEY AUTOINCREMENT, 
	longitude FLOAT NOT NULL, 
	latitude FLOAT NOT NULL, 
	eventid INTEGER NOT NULL, 
	FOREIGN KEY (eventid) REFERENCES users(eventid) ON DELETE CASCADE
);

CREATE INDEX event_label_index
ON event_labels (label, eventid);
