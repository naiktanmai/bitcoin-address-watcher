drop table if exists btc_balance cascade;

CREATE TABLE btc_balance(
   recipient varchar(50) PRIMARY KEY NOT NULL,
   amount float,
   created_ts timestamp not null default current_timestamp,
   modified_ts timestamp not null default current_timestamp
);

INSERT INTO
   btc_balance ( "recipient", "amount" ) 
VALUES
   (
      '2Mxs1sYMGh2dR5tHBLCMnhdjMim8Kvn88wW', 0.0
   ), 
   (
      '2MvVK98nuCj9TsPWJ855njDT733CKwpVdCw', 0.0
   ), 
   (
      '2N3xPEq3AiWXgW6QnyN15efaMqVPC1SBsTd', 0.0
   ), 
   (
      '2N5xZUhG3mTpUhRd6FCFuFXUhwA1TQ9Zy4z', 0.0
   ), 
   (
      '2MvVPENNKb2gLHvnR7WRWjSB3F7HpnfD2ZV', 0.0
   );
    

drop table if exists btc_transactions cascade;

CREATE TABLE btc_transactions(
   transaction_id varchar(30) PRIMARY KEY NOT NULL,
   recipient varchar(50),
   amount float,
   created_ts timestamp not null default current_timestamp,
   modified_ts timestamp not null default current_timestamp,
   FOREIGN KEY (recipient) REFERENCES btc_balance (recipient)
);