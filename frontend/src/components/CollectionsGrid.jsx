import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { BsClockHistory } from 'react-icons/bs';
import './CollectionsGrid.css';

const collections = [
  {
    id: '01',
    title: 'OVERSIZED\nT-SHIRTS',
    description: 'Relaxed silhouettes with premium heavyweight fabric for maximum comfort.',
    link: '/collections/oversized',
    gridArea: 'oversized',
    imagePos: 'left'
  },
  {
    id: '04',
    title: 'LIMITED\nDROPS',
    description: 'Exclusive designs released in limited quantities. Once sold out, they may never return.',
    link: '/limited-drops',
    gridArea: 'limited',
    extra: 'LIMITED QUANTITY',
    imagePos: 'right'
  },
  {
    id: '02',
    title: 'URBAN NOIR',
    description: 'Contemporary streetwear inspired by dark aesthetics, clean lines, and everyday versatility.',
    link: '/collections/urban',
    gridArea: 'urban',
    imagePos: 'left'
  },
  {
    id: '03',
    title: 'NEW\nARRIVALS',
    description: 'The latest designs added to the Unicorn collection. Fresh drops. New energy.',
    link: '/collections/new',
    gridArea: 'new',
    imagePos: 'right'
  }
];

const CollectionsGrid = () => {
  return (
    <section className="collections" id="collections">
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">COLLECTIONS</p>
          <h2 className="section-title">EXPLORE OUR COLLECTIONS</h2>
          <div className="divider-with-icon">
            <svg viewBox="0 0 100 100" width="16" height="10" className="divider-gothic-cross">
              <path d="M50 2 L54 7 L52 12 L52 30 L72 30 L72 36 L54 36 L52 85 L50 88 L48 85 L46 36 L28 36 L28 30 L48 30 L48 12 L46 7 Z" fill="white" />
            </svg>
          </div>
          <p className="section-desc">
            Bold designs. Premium quality. Made for the shadows.
          </p>
        </div>

        <div className="collections-grid-2x2">
          {collections.map((col) => (
            <Link to={col.link} key={col.id} className={`collection-card-v2 ${col.gridArea}`}>
              {/* Image Section */}
              <div className={`col-image-wrapper ${col.imagePos}`}>
                <div className={`mockup-crop crop-${col.gridArea}`}></div>
              </div>

              {/* Content Section */}
              <div className="col-content">
                <span className="col-num">{col.id}</span>
                <h3 className="col-title">{col.title}</h3>
                <p className="col-desc">{col.description}</p>
                <div className="col-action">
                  EXPLORE COLLECTION <FiArrowRight className="arrow-icon" />
                </div>
                {col.extra && (
                  <div className="col-extra">
                    <BsClockHistory className="clock-icon" /> {col.extra}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CollectionsGrid;
