name := "WikiWord2Vec"
version := "1.0"
scalaVersion := "2.10.5"

resolvers += "surfsara" at "http://beehub.nl/surfsara-repo/releases"

libraryDependencies ++= Seq(
  "org.apache.spark" %% "spark-core" % "1.6.1" % "provided",
  "org.apache.spark" % "spark-mllib_2.10" % "1.6.1" % "provided",
  "org.scalaj" % "scalaj-http_2.10" % "2.3.0",
  "net.liftweb" %% "lift-json" % "2.6",
  "org.jsoup" % "jsoup" % "1.9.2",
  "org.jwat" % "jwat-warc" % "1.0.4",
  "nl.surfsara" % "warcutils" % "1.3"
)
