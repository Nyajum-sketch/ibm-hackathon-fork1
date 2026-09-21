import React from 'react';
import { Sparkles } from 'lucide-react';

export default function TicketCard({
  icon: Icon = Sparkles,
  type = 'FEATURE',
  title = 'Ticket Title',
  subtitle = 'Ticket Subtitle description goes here.',
  details = [],
  barcodeId = 'SIG-AI-994',
  admitNum = '01',
  onClick,
  className = ''
}) {
  return (
    <div className={`ticket-wrapper ${className}`} onClick={onClick}>
      <div className="ticket">
        {/* Top Main Section with Radial Cutouts */}
        <div className="t-main">
          <div className="t-content">
            {/* Header: Logo & Badge */}
            <div className="t-header">
              <div className="t-logo">
                <Icon />
                <span>SIGNIFY AI</span>
              </div>
              <div className="t-type">{type}</div>
            </div>

            {/* Title & Subtitle */}
            <div className="t-title">{title}</div>
            <div className="t-subtitle">{subtitle}</div>

            {/* Grid of Details */}
            {details.length > 0 && (
              <div className="t-details">
                {details.map((item, idx) => (
                  <div key={idx} className="t-detail-item">
                    <span className="t-label">{item.label}</span>
                    <span className="t-value">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Perforation Line with Notches */}
        <div className="t-perforation">
          <div className="t-perf-line" />
        </div>

        {/* Bottom Stub with Barcode and Admit # */}
        <div className="t-stub">
          <div className="t-barcode-container">
            <div className="t-barcode" />
            <div className="t-barcode-id">{barcodeId}</div>
          </div>
          <div className="t-admit">
            <div className="t-admit-text">ADMIT</div>
            <div className="t-admit-num">{admitNum}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
