import { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronUp, FiMessageSquare } from 'react-icons/fi';
import './FAQ.css';

const DEFAULT_FAQS = [
  {
    _id: 'default-1',
    category: 'Orders & Shipping',
    question: 'How long does shipping take?',
    answer: 'Orders are processed within 24-48 hours. Metro orders deliver in 3-4 business days, while regional orders take 4-6 business days.'
  },
  {
    _id: 'default-2',
    category: 'Orders & Shipping',
    question: 'Can I cancel or change my order?',
    answer: 'Once an order is captured, it is immediately routed to our distribution archives. Please reach out to customer support immediately if you need any adjustments.'
  },
  {
    _id: 'default-3',
    category: 'Returns & Exchanges',
    question: 'What is your return policy?',
    answer: 'We offer a hassle-free 14 days return policy. Items must be returned in their original condition: unworn, unwashed, and with all tags intact.'
  },
  {
    _id: 'default-4',
    category: 'Garment Construction',
    question: 'What does "GSM" mean in your products?',
    answer: 'GSM stands for Grams per Square Meter. It indicates fabric weight. Our 300+ GSM items are heavyweight, durable, and custom-knitted for that perfect structured oversized silhouette.'
  },
  {
    _id: 'default-5',
    category: 'Garment Construction',
    question: 'How should I wash my streetwear items?',
    answer: 'To preserve prints and fabric life, machine wash cold inside out, use mild liquid detergent, avoid bleach, and lay flat to dry in the shade.'
  }
];

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedFaqId, setExpandedFaqId] = useState(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const res = await fetch('/api/faqs');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setFaqs(data);
          } else {
            setFaqs(DEFAULT_FAQS);
          }
        } else {
          setFaqs(DEFAULT_FAQS);
        }
      } catch (error) {
        console.error(error);
        setFaqs(DEFAULT_FAQS);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggleFaq = (id) => {
    setExpandedFaqId(expandedFaqId === id ? null : id);
  };

  // Group by category
  const groupedFaqs = faqs.reduce((acc, faq) => {
    const cat = faq.category || 'General';
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(faq);
    return acc;
  }, {});

  return (
    <div className="faq-page-wrapper fade-in">
      <div className="container faq-container">
        <div className="faq-header-hero">
          <h1 className="gothic-title-lg">FREQUENTLY ASKED QUESTIONS</h1>
          <p className="faq-subtitle">Summon clarity from the shadows. Find answers to common queries below.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-gold)' }}>
            <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
            <p style={{ fontSize: '0.8rem', letterSpacing: '2px' }}>SUMMONING ARCHIVES...</p>
          </div>
        ) : (
          <div className="faq-content-layout">
            {Object.keys(groupedFaqs).map((cat) => (
              <div key={cat} className="faq-category-section">
                <h2 className="faq-category-title">{cat.toUpperCase()}</h2>
                
                <div className="faq-accordion-list">
                  {groupedFaqs[cat].map((faq) => {
                    const isExpanded = expandedFaqId === faq._id;
                    return (
                      <div 
                        key={faq._id} 
                        className={`faq-accordion-card ${isExpanded ? 'expanded' : ''}`}
                      >
                        <div 
                          className="faq-question-row" 
                          onClick={() => toggleFaq(faq._id)}
                        >
                          <span className="faq-question-text">{faq.question}</span>
                          <span className="faq-icon-wrapper">
                            {isExpanded ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                          </span>
                        </div>
                        
                        {isExpanded && (
                          <div className="faq-answer-row">
                            <p className="faq-answer-text">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="faq-help-footer">
          <FiMessageSquare size={32} className="faq-footer-icon" />
          <h3>Still Lost in the Shadows?</h3>
          <p>If your query remains unanswered, open a support ticket from your Account dashboard and our guardians will assist you.</p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
