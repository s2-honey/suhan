// src/components/ReportCard.jsx
import React from 'react';
import '../styles/ReportCard.css';

const ReportCard = ({ text }) => (
  <div className="report-card">
    <div className="card-text">{text}</div>
  </div>
);

export default ReportCard;
