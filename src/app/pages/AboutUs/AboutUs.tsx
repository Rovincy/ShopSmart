import React, { useState } from 'react';
import { Card, Row, Col, Typography, Button } from 'antd';
import { toAbsoluteUrl } from '../../../_metronic/helpers';

const { Title, Paragraph, Text } = Typography;

interface CardItem {
  title: string;
  summary: string;
  details: string;
  mapLink?: string; // optional for the geolocation link
}

const AboutUs = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const cardData: CardItem[] = [
    {
      title: 'About Us',
      summary: 'Discover who we are and what we do.',
      details: `We are a passionate team providing innovative digital solutions. Our mission is to empower businesses with technology that drives success. Founded in 2010, we have served over 200 clients worldwide.`,
    },
    {
      title: 'Contact Us',
      summary: 'Get in touch for inquiries or support.',
      details: `You can contact us via:\n\n📧 Email: support@company.com\n📞 Phone: +1 234 567 890\n🏢 Address: 456 Tech Avenue, Innovation City`,
    },
    {
      title: 'Partners',
      summary: 'Meet our strategic partners.',
      details: `We collaborate with industry leaders including:\n\n- AlphaTech Solutions\n- BetaSoft Enterprises\n- Gamma Innovations\n\nOur partnerships help deliver top-notch services globally.`,
    },
    {
      title: 'School Accreditation',
      summary: 'Learn about our official recognitions.',
      details: `Our school is accredited by the National Accreditation Board (NAB) and recognized internationally for maintaining high educational standards.`,
    },
    {
      title: 'School Geolocation',
      summary: 'Find our campus on Google Maps.',
      details: `📍 2i Site 2 \n\nClick the button below to view our location on Google Maps.`,
      mapLink: 'https://www.google.com/maps?q=-4.781561,11.856546',
    },
    {
      title: 'School Geolocation',
      summary: 'Find our campus on Google Maps.',
      details: `📍 2i Site 3 \n\nClick the button below to view our location on Google Maps.`,
      mapLink: 'https://www.google.com/maps?q=-4.775868,11.858470',
    },
    {
      title: 'School Geolocation',
      summary: 'Find our campus on Google Maps.',
      details: `📍 2i Site 5 \n\nClick the button below to view our location on Google Maps.`,
      mapLink: 'https://www.google.com/maps?q=-4.810524,11.871825',
    },
  ];

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundImage: `url(${toAbsoluteUrl('media/logos/favicon.ico')})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1,
        }}
      />

      {/* Top Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          color: '#fff',
          padding: '40px 40px 0 40px',
        }}
      >
        {/* <Title level={2} style={{ color: '#fff', marginBottom: '40px' }}>Welcome to Our Page</Title> */}

        <Row gutter={[24, 24]} justify="start">
          {cardData.map((card) => {
            const isHovered = hoveredCard === card.title;

            return (
              <Col xs={24} sm={12} md={8} key={card.title}>
                <div
                  onMouseEnter={() => setHoveredCard(card.title)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    transition: 'all 0.3s ease',
                    transform: isHovered ? 'translateY(-10px)' : 'translateY(0)',
                    cursor: 'pointer',
                  }}
                >
                  <Card
                    title={card.title}
                    hoverable
                    style={{
                      borderRadius: '12px',
                      boxShadow: isHovered
                        ? '0 16px 30px rgba(0,0,0,0.3)'
                        : '0 8px 16px rgba(0,0,0,0.2)',
                      transition: 'all 0.3s ease',
                      backgroundColor: '#ffffff',
                      color: '#333',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '16px',
                    }}
                  >
                    <Paragraph style={{ color: '#555' }}>{card.summary}</Paragraph>

                    <Paragraph
                      style={{
                        marginTop: '20px',
                        whiteSpace: 'pre-line',
                        color: '#666',
                      }}
                    >
                      {card.details}
                    </Paragraph>

                    {card.mapLink && (
                      <Button
                        type="primary"
                        href={card.mapLink}
                        target="_blank"
                        style={{
                          marginTop: '16px',
                          alignSelf: 'flex-start',
                        }}
                      >
                        View on Google Maps
                      </Button>
                    )}
                  </Card>
                </div>
              </Col>
            );
          })}
        </Row>
      </div>
    </div>
  );
};

export { AboutUs };
