name := "WikiWord2Vec"
version := "1.0"
scalaVersion := "2.10.5"

libraryDependencies ++= Seq(
  "org.apache.spark" %% "spark-core" % "1.6.1" % "provided",
  "org.apache.spark" % "spark-mllib_2.10" % "1.6.1" % "provided",
  "edu.umd" % "cloud9" % "2.0.1"
)
