import React from "react";
import {
  Instagram,
  Linkedin,
  Github,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import logo from "./../../../assets/logoD.png";

import "./footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer" id="footer">
      <div className="footer-container">
        {/* Brand / About */}
        <div className="footer-section footer-brand-container">
          <img src={logo} alt="NearGo" className="footer-logo" />
          <p className="footer-text">
            NearGo helps people discover and stay connected with great
            businesses around them and beyond.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>

          <ul>
            <li>
              <a href="#">Explore</a>
            </li>
            <li>
              <Link to="/About">About</Link>
            </li>
          </ul>
        </div>

        {/* Contact Details */}
        <div className="footer-section">
          <h3>Contact</h3>

          <div className="contact-item">
            <Mail size={18} />
            <span>sharathhv88@gmail.com</span>
          </div>

          <div className="contact-item">
            <Phone size={18} />
            <span>+91 86600 29884</span>
          </div>

          <div className="contact-item">
            <MapPin size={18} />
            <span>Hassan, India</span>
          </div>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h3>Follow Me</h3>
          <div className="social-links">
            <a
              href="https://www.instagram.com/sharath___11"
              target="_blank"
              rel="noreferrer"
            >
              <Instagram size={20} />
            </a>
            <a
              href="https://linkedin.com/in/SharathHV"
              target="_blank"
              rel="noreferrer"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://github.com/Sharathhv11"
              target="_blank"
              rel="noreferrer"
            >
              <Github size={20} />
            </a>
            <a
              href="https://x.com/imsharath11?s=09"
              target="_blank"
              rel="noreferrer"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} NearGo. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
