CREATE TABLE user (username VARCHAR(60) NOT NULL UNIQUE, full_name VARCHAR(60) NOT NULL, email VARCHAR(60) NOT NULL, profile_img VARCHAR(60) DEFAULT 'profile_default.png', PRIMARY KEY(id));

CREATE TABLE blog (id VARCHAR(10) PRIMARY KEY NOT NULL UNIQUE, heading VARCHAR(120) NOT NULL, tags VARCHAR(60), content TEXT NOT NULL, blog_date VARCHAR(45) NOT NULL, username VARCHAR(60) NOT NULL, author VARCHAR(60) NOT NULL, FOREIGN KEY (username) REFERENCES user(username));

CREATE TABLE comment (blog_id VARCHAR(10) NOT NULL, username VARCHAR(60) NOT NULL, user_fullname VARCHAR(60) NOT NULL, comment VARCHAR(500) NOT NULL, comment_date VARCHAR(45) NOT NULL, FOREIGN KEY (blog_id) REFERENCES blog(id), FOREIGN KEY (username) REFERENCES user(username));

CREATE TABLE blog_stats (blog_id VARCHAR(10) NOT NULL, views int, likes int, dislikes int, FOREIGN KEY (blog_id) REFERENCES blog(id));

CREATE TABLE tag (name VARCHAR(60) NOT NULL PRIMARY KEY UNIQUE, articles int NOT NULL);

CREATE TABLE blog_tags (tag_name VARCHAR(60) NOT NULL, blog_id VARCHAR(10) NOT NULL, FOREIGN KEY (tag_name) REFERENCES tag(name), FOREIGN KEY (blog_id) REFERENCES blog(id));







CREATE PROCEDURE inputTags (in blog_id VARCHAR(10), in tag_one VARCHAR(60), in tag_two VARCHAR(60), in tag_three VARCHAR(60))
BEGIN
	
	IF ((SELECT articles FROM tag WHERE name=tag_one) > 0) THEN
		UPDATE tag SET articles=articles+1 WHERE name=tag_one;
	ELSE
		INSERT INTO tag VALUES (tag_one, 1, 1);
	END IF;
	INSERT INTO blog_tags VALUES (tag_one, blog_id);

	IF (tag_two IS NOT NULL) THEN
		IF ((SELECT articles FROM tag WHERE name=tag_two) > 0) THEN
			UPDATE tag SET articles=articles+1 WHERE name=tag_two;
		ELSE
			INSERT INTO tag VALUES (tag_two, 1, 1);
		END IF;
		INSERT INTO blog_tags VALUES (tag_two, blog_id);
	END IF;

	IF (tag_three IS NOT NULL) THEN
		IF ((SELECT articles FROM tag WHERE name=tag_three) > 0) THEN
			UPDATE tag SET articles=articles+1 WHERE name=tag_three;
		ELSE
			INSERT INTO tag VALUES (tag_three, 1, 1);
		END IF;
		INSERT INTO blog_tags VALUES (tag_three, blog_id);
	END IF;

END$$












DROP PROCEDURE inputTags;

CREATE TRIGGER createStats AFTER INSERT ON blog FOR EACH ROW
BEGIN
	INSERT INTO blog_stats (blog_id) VALUES (NEW.id);
END$$

CREATE TRIGGER updateTag AFTER UPDATE ON blog_stats FOR EACH ROW
BEGIN
	UPDATE tag SET popularity=popularity+1 WHERE name in (SELECT tag_name FROM blog_tags WHERE blog_id=NEW.blog_id);
END$$





INSERT INTO blog VALUES ('aF32EEx', 'React Performance Boost', 'Performance problems in web apps are not new.\nEveryone knows that moment when you take a new component, add it to your app — and suddenly every single user interaction you attempt has a noticeable performance lag! Sometimes, you can even use the same component multiple times and get an embarrassing animation.\nThe component lifecycle hook shouldComponentUpdate is meant to prevent unnecessary renders. shouldComponentUpdate gets the next props and state as arguments, and if it returns true, the render function will be executed. Otherwise, it won’t.\nThe default implementation for React.Component is return true.\nMore renders means updates take more time, so we prevent unneeded updates to reduce that extra time. To do so, you’d think we’d want to implement strict shouldComponentUpdate functions to the extent we can, right?', '2017-11-12 12:11:21', 'ahmednr123');
INSERT INTO tag VALUES ('tech', 1, 1);
INSERT INTO blog_tags VALUES ('tech', 'aF32EEx');

INSERT INTO blog VALUES ('FQ21R2', 'Fiona Hacks Windows', 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. \nThe first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.', '2017-11-09 12:11:21', 'ahmednr123');
INSERT INTO tag VALUES ('funny', 1, 1);
INSERT INTO tag VALUES ('tech', 1, 1);
INSERT INTO blog_tags VALUES ('funny', 'FQ21R2');
INSERT INTO blog_tags VALUES ('tech', 'FQ21R2');

UPDATE tag SET articles=articles+1 WHERE name='tech';
UPDATE tag SET articles=articles+1 WHERE name='funny';
UPDATE tag SET articles=articles+1 WHERE name='sports';

INSERT INTO blog VALUES ('4rTaXF', 'Aizwal', 'There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which dont look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isnt anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.\nThe standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.', '2017-11-01 12:11:21', 'ahmednr123');
INSERT INTO tag VALUES ('#KEBvAFC', 1, 1);
INSERT INTO tag VALUES ('sports', 1, 1);
INSERT INTO blog_tags VALUES ('#KEBvAFC', '4rTaXF');
INSERT INTO blog_tags VALUES ('sports', '4rTaXF');

INSERT INTO blog VALUES ('rR3fBv', 'Embarrassing Act By Ricky Ponting', 'But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure?', '2017-10-11 12:11:21', 'ahmednr123');
INSERT INTO tag VALUES ('funny', 1, 1);
INSERT INTO tag VALUES ('sports', 1, 1);
INSERT INTO tag VALUES ('history', 1, 1);
INSERT INTO blog_tags VALUES ('funny', 'rR3fBv');
INSERT INTO blog_tags VALUES ('sports', 'rR3fBv');
INSERT INTO blog_tags VALUES ('history', 'rR3fBv');

INSERT INTO blog VALUES ('BVf23E', 'Do Aliens Really Exist', 'On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. \nIn a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.', '2017-04-03 12:11:21', 'ahmednr123');
INSERT INTO tag VALUES ('science', 1, 1);
INSERT INTO blog_tags VALUES ('science', 'BVf23E');

INSERT INTO blog VALUES ('T3gRaa', 'This Should Stop', 'Petentium efficiantur has ad, in qui semper suscipiantur. Te dico deleniti pri. Et pri viderer admodum reprehendunt, his ad illum utinam. Vim te nobis detracto. Ut eos labitur praesent, minim feugiat id ius, vero elit tempor cum et. In fuisset partiendo ius.\nId duo ceteros volumus repudiandae. Ne vim dicant aliquip, augue ancillae apeirian te mea. Vim nobis noluisse at. Quot mucius pri ea.\nQui quas voluptaria ne, ea vel simul vocent, nemore antiopam maluisset id vis. Omnesque suscipiantur consectetuer ne vel, an erant dictas gloriatur mel. Mel ut quem veri sensibus. At ornatus albucius voluptatibus pro. Mei an discere voluptua disputationi, vocibus offendit has cu. Assum clita eu sea, eam ut tantas populo. Eos nominati elaboraret ut, sea te eius tritani, explicari eloquentiam ei sit.\nProbo assum propriae ex has, cu sed justo nostro maluisset. His at habemus invidunt legendos, usu id eius omnes menandri. Cum natum atqui detraxit ne, vix salutandi adolescens voluptatibus ad, sed tota vidit putent ad. Te consul pertinacia cum. Ius an erat hendrerit.', '2017-06-27 12:11:21', 'ahmednr123');
INSERT INTO tag VALUES ('news', 1, 1);
INSERT INTO blog_tags VALUES ('news', 'T3gRaa');