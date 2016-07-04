import os

import pandas as pd
import numpy as np
from sklearn.manifold import TSNE
from sklearn.externals import joblib
import matplotlib.pyplot as plt

def plot_embedding(X):
    x_min, x_max = np.min(X, 0), np.max(X, 0)
    X = (X - x_min) / (x_max - x_min)

    plt.scatter(X[:, 0], X[:, 1])
    plt.show()

def get_embeddings(X):
    if os.path.isfile('tsne.p'):
        print('Embeddings found, loading them...')
        return joblib.load('tsne.p')

    print('Running t-SNE...')
    tsne = TSNE()
    embedded = tsne.fit_transform(X)
    joblib.dump(embedded, 'tsne.p')
    return embedded

def run():
    data = pd.read_csv('word2vecmodel.csv', header=0, names=['word'] + list(range(300)))
    vectors = data.drop(['word'], axis=1).as_matrix()

    embedded = get_embeddings(vectors)
    pd.concat([data.word, pd.DataFrame(embedded)], axis=1).to_csv('embeddings.csv')


    plot_embedding(embedded)

if __name__ == '__main__':
    run()
