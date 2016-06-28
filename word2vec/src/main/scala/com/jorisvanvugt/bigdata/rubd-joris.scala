package com.jorisvanvugt.bigdata

import java.text.SimpleDateFormat
import java.util.Date
import java.io._

import org.apache.spark.{SparkConf, SparkContext}
import org.apache.spark.mllib.feature.{Word2Vec, Word2VecModel}
import edu.umd.cloud9.collection.wikipedia._
import edu.umd.cloud9.collection.wikipedia.language._

object WikiWord2Vec {

  def tokenize(page: String): Seq[String] = {
    page.split("\n")
      .mkString(" ")
      .split(" ")
      .map(_.toLowerCase.replaceAll("(^[^a-z]+|[^a-z]+$)", ""))
      .toSeq
  }


  def main(args: Array[String]) {
    println("Setting up Spark Context...")
    val conf = new SparkConf()
      .setAppName("RUBigDataApp")
    val sc = new SparkContext(conf)

    val filename = "hdfs:///data/public/wikipedia/enwiki/20140903/enwiki-20140903-pages-articles.xml.bz2"

    val file = sc.newAPIHadoopFile(filename,
      classOf[WikipediaPageInputFormat],
      classOf[LongWritable],
      classOf[WikipediaPage]).repartition(100)

    val articlesWithContent = file.filter{_.isEmpty}.cache

    println("Nr of articles: " + articlesWithContent.count)

    val corpus = articles.map{article => tokenize(article.getContent)}

    val dateFormat = new SimpleDateFormat("yyyy_MM_dd_HH_mm_ss")
    println("Training word2vec model")
    val word2vec = new Word2Vec
    word2vec.setMinCount(30)
    val model = word2vec.fit(corpus)

    println("Saving the model...")
    val pw = new PrintWriter(new File("word2vecmodel.csv" ))
    val vectors = model.getVectors
    pw.write("word," + (0 to 99).mkString(","))
    for (word <- vectors) {
      pw.write(word._1 + "," + word._2.mkString(",") + "\n")
    }
    pw.close
  }

}
