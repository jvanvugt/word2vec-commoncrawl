# Word2Vec on Common Crawl data

This is my project for the final assignment of Big Data (NWI-IBC036).
The assignment is very free-form ("Do something with the commoncrawl data on a cluster").

### Idea
The goal of this project is to train a [word2vec](https://en.wikipedia.org/wiki/Word2vec) model on English and simple English Wikipedia pages. Next, I will run [t-SNE](https://en.wikipedia.org/wiki/T-distributed_stochastic_neighbor_embedding) on the word vectors to create an (interactive) plot.

### Structure
The `word2vec` folder contains a Spark application for training Word2Vec. Build the project by running `sbt assembly` in the `word2vec` folder.

The `tsne` folder uses the t-SNE implementation from sk-learn to calculate an embedding in 2d of the Word2Vec model. This implementation tends to take a lot of memory.

The `webinterface` folder is a web server in Flask. It is a web interface for interaction with the Word2Vec model (e.g. computing `king - man + woman` which hopefully results in `queen`). It also shows an interactive chart of the t-SNE of the model.


### Implementation
This is my first project in Scala and my first project that will be deployed on a cluster ([Surfsara's Hathi cluster](https://userinfo.surfsara.nl/systems/hadoop/hathi)) so not everything might be optimal.

I have directly copied a Porter stemming implementation in Scala from https://github.com/aztek/porterstemmer.

Relevant archives are found by parsing http://index.commoncrawl.org/CC-MAIN-2016-07-index?url=wikipedia.org&output=json.

### TODO
- Stream line implementations:
    - save csv in Spark application instead of saving the model
    - Fix pandas csv writing (column names)
- Train on larger dataset (maybe add some more websites)
- Calculate some metrics of the size of the dataset
- Better preprocessing:
    - No more stemming
    - Better non-word filter/increase min count
