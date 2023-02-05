# pcibex-to-postgres

pcibex-to-postgres is a tiny api that allows our lab to receive results from pcibex and add them to our postgres database. There are just two endpoints:

- /create-run : creates a run of the experiment into your database (inserts a row) 
- /update-run : updates an existing run of the experiment into your database (updates a row)

pcibex-to-postgres makes a few assumptions you should know about:

- assumptions about your pcibex experiments:
    - your pcibex experiments calls `.SendResults('yoururl/crete-run')` somewhere at the start of your experiment
    - your pcibex experiment calls `.SendResults('yoururl/update-run')` anytime you want to send data to your database. And you have already called .SendResults('yoururl/create-run') at the begining of your experiment
- assumptions about the database:
    - your database has at least two columns: (1) one to hold a unique identifier for each run of your experiment - this gets passed by PCIbex automatically when you call `SendResults` and (2) one to hold the data from the run (in json format). You can specify the names of these to columns in your .env file.

pcibex-to-postgres will validate incoming requests by default to ensure:
- the request is coming from a trusted host (e.g. upenn.pcibext.net, or farm.pcibex.net)
- the request is a well-formed pcibex result
- the request query string contains the url variables you specify






