# Word2Vec on Common Crawl data

This is my project for the final assignment of Big Data (NWI-IBC036).
The assignment is very free-form ("Do something with the commoncrawl data on a cluster").

### Idea
The goal of this project is to train a [word2vec](https://en.wikipedia.org/wiki/Word2vec) model on English and simple English Wikipedia pages. Next, I will run [t-SNE](https://en.wikipedia.org/wiki/T-distributed_stochastic_neighbor_embedding) on the word vectors to create an (interactive) plot (hopefully).


### Implementation
This is my first project in Scala and my first project that will be deployed on a cluster ([Surfsara's Hathi cluster](https://userinfo.surfsara.nl/systems/hadoop/hathi)) so not everything might be optimal.

I have directly copied a Porter stemming implementation in Scala from https://github.com/aztek/porterstemmer. 

Relevant archives are found by parsing http://index.commoncrawl.org/CC-MAIN-2016-07-index?url=wikipedia.org&output=json.
