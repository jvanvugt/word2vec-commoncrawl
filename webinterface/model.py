import re

import scipy.spatial as sp
import numpy as np
import pandas as pd

class Word2VecModel():

    def __init__(self, vectors_file, embeddings_file):
        print('creating model...')
        vectors = pd.read_csv(vectors_file, header=0,
            names=['word'] + list(range(100)))
        words = vectors.word
        # Save the vectors in a dictionary (word -> vector)
        self.vectors = {w: v for w, v in zip(words, vectors.drop(['word'], axis=1).as_matrix())}
    
    def parse_query(self, query):
        positive = list(map(lambda l: re.findall(r"[\w']+", l)[0].strip().lower(), query.split('+')))
        negative = list(map(lambda l: re.findall(r"[\w']+", l)[0].strip().lower(), query.split('-')))
        if positive[0] == negative[0]:
            negative = negative[1:]
        return positive, negative


    def synonyms(self, query, n=5):
        positive, negative = self.parse_query(query)
        print(query)
        print(positive, negative)
        for word in positive + negative:
            if word not in self.vectors:
                return [word + ' not in vocabulary']

        vector = np.zeros(100)
        vector += sum(map(lambda w: self.vectors[w], positive))
        vector -= sum(map(lambda w: self.vectors[w], negative))

        similarities = []
        # If only one word was given, we don't want to see that word in the results
        if len(positive + negative) == 1:
            similarities = [(other, 1 - sp.distance.cosine(vector, self.vectors[other])) 
                                for other in self.vectors if other != word]
        else:
            similarities = [(other, 1 - sp.distance.cosine(vector, self.vectors[other])) 
                                for other in self.vectors]
        return sorted(similarities, key=lambda x: -x[1])[:n]

if __name__ == '__main__':
    model = Word2VecModel('word2vecmodel.csv', 'embeddings.csv')
    print(model.synonyms('man'))
