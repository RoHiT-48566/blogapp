import React from "react";
import styles from "./Home.module.css";

function Home() {
  return (
    <div className={styles.home}>
      <h1 className={styles.heading}>Welcome!</h1>
      <p>
        Welcome to My Blog App! Here, we bring you a blend of insightful
        articles, personal stories, and thought-provoking discussions on topics
        that matter. Whether you're passionate about technology, lifestyle,
        travel, or personal growth, our blog is designed to inspire, inform, and
        engage. Join our community of curious minds and explore a world of ideas
        and experiences. Dive into our latest posts and discover content that
        resonates with your interests and fuels your passion for knowledge.
        Let's embark on this journey together!
      </p>
    </div>
  );
}

export default Home;
