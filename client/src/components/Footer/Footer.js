import React from "react";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <div className="h-100 w-100">
      <footer className={`${styles.footer} text-center`}>
        <div className={`${styles.footerLogo}`}>Blogs</div>
        <ul className={`${styles.footerList} list-unstyled`}>
          <li className={`${styles.footerItem}`}>
            <a href="/about" className={`${styles.footerLink}`}>
              About Us
            </a>
          </li>
          <li className={`${styles.footerItem}`}>
            <a href="/contact" className={`${styles.footerLink}`}>
              Contact
            </a>
          </li>
          <li className={`${styles.footerItem}`}>
            <a href="/privacy" className={`${styles.footerLink}`}>
              Privacy Policy
            </a>
          </li>
          <li className={`${styles.footerItem}`}>
            <a href="/terms" className={`${styles.footerLink}`}>
              Terms of Service
            </a>
          </li>
          <li className={`${styles.footerItem}`}>
            <a
              href="mailto:blogapp45@gmail.com"
              className={`${styles.footerLink}`}
            >
              blogapp45@gmail.com
            </a>
          </li>
          <li className={`${styles.footerItem}`}>Contact: 9876543218</li>
        </ul>
      </footer>
    </div>
  );
}

export default Footer;
