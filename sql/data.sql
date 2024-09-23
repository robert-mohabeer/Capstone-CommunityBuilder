INSERT INTO users (username, fullname, email, filename, password, age, about_me) VALUES 
('JohnS', 'John Smith', 'john@example.com', 'john.jpg', 'password', 30, 'I love hiking and exploring new places.'),
('EmilyJ', 'Emily Johnson', 'emily@example.com', 'emily.jpg', 'password', 28, 'Art is my passion, and I enjoy painting and sketching in my free time.'),
('MichaelB', 'Michael Brown', 'michael@example.com', 'michael.jpg', 'password', 35, 'I am an avid nature enthusiast and enjoy outdoor activities like hiking and camping.'),
('JessicaM', 'Jessica Miller', 'jessica@example.com', 'jessica.jpg', 'password', 25, 'Books are my escape, and Im always looking for recommendations for my next read.'),
('DavidW', 'David Wilson', 'david@example.com', 'david.jpg', 'password', 32, 'Yoga and meditation help me find balance and peace in my busy life.');


INSERT INTO events (title, description, owner, date, location, address, time, mapcoord1, mapcoord2)
VALUES 
('Summer Picnic', 'Join us for a fun-filled picnic at Burns Park! Bring your favorite snacks and games.', 'JohnS', '2024-07-15', 'Burns Park', '1300 Baldwin Ave, Ann Arbor, MI 48104', '12:00 PM', 42.2808, -83.7430),
('Art Workshop', 'Explore your creativity at our art workshop. All skill levels welcome!', 'EmilyJ', '2024-08-02', 'Art Studio', '456 Art Street', '2:00 PM', 42.3008, -83.7133),
('Nature Hike', 'Embark on a scenic hike through the mountains. Don''t forget your hiking boots!', 'MichaelB', '2024-09-10', 'Mountain Trail', '789 Mountain Road', '10:00 AM', 42.2800, -83.7631),
('Book Club Meeting', 'Discuss the latest bestseller with fellow book enthusiasts. This month: "The Great Gatsby."', 'JessicaM', '2024-08-20', 'Local Library', '101 Library Lane', '6:30 PM', 42.2858, -83.7940),
('Yoga Session', 'Relax and rejuvenate with a yoga session in the park. Mats provided!', 'DavidW', '2024-07-30', 'City Park', '321 Park Street', '9:00 AM', 42.2908, -83.7632);


INSERT INTO comments (owner, eventid, text ) VALUES 
('JohnS', 1, 'Sounds great! Ill definitely be there.'),
('EmilyJ', 2, 'Im excited to attend this workshop!'),
('MichaelB', 3, 'Count me in! Nature hikes are always refreshing.'),
('JessicaM', 4, 'Looking forward to discussing "The Great Gatsby" with everyone!'),
('DavidW', 5, 'Yoga in the park sounds like the perfect way to unwind.');

INSERT INTO rsvps (owner, eventid) VALUES 
('JohnS', 1),
('EmilyJ', 2),
('MichaelB', 3),
('JessicaM', 4),
('DavidW', 5),
('JohnS', 3),
('EmilyJ', 4),
('MichaelB', 2),
('JessicaM', 5),
('DavidW', 1);

INSERT INTO event_labels (eventid, label) VALUES 
(1, 'Low Vision'),
(1, 'Low Mobility'),
(1, 'Wheelchair Access'),
(1, 'Visual Support'),
(1, 'Hearing Support'),
(1, 'Language Access'),
(1, 'Child-Friendly'),
(2, 'Low Vision'),
(2, 'Low Mobility'),
(2, 'Wheelchair Access'),
(2, 'Language Access'),
(2, 'Virtual Access'),
(2, 'Transportation Access'),
(2, 'Child-Friendly'),
(3, 'Low Vision'),
(3, 'Wheelchair Access'),
(3, 'Visual Support'),
(3, 'Hearing Support'),
(3, 'Mobility Aid Access'),
(4, 'Mobility Aid Access'),
(4, 'Sensory Sensitivity'),
(4, 'Assistance Animals'),
(5, 'Visual Support'),
(5, 'Hearing Support'),
(5, 'Mobility Aid Access'),
(5, 'Sensory Sensitivity'),
(5, 'Assistance Animals'); 