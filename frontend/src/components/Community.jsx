import { useState, useEffect, useRef } from 'react';
import { FiMail, FiArrowRight, FiShield, FiPlay, FiPause, FiVolume2, FiVolumeX, FiMusic } from 'react-icons/fi';
import './Community.css';

const socialCards = [
  {
    name: 'INSTAGRAM',
    desc: 'Daily outfit inspiration and new drops',
    linkText: 'FOLLOW US',
    url: 'https://instagram.com',
    icon: (
      <svg viewBox="0 0 24 24" className="social-svg-icon">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    )
  },
  {
    name: 'DISCORD',
    desc: 'Join our server and be part of the family',
    linkText: 'JOIN SERVER',
    url: 'https://discord.com',
    icon: (
      <svg viewBox="0 0 24 24" className="social-svg-icon">
        <path d="M20.3 5.15a14.9 14.9 0 0 0-3.67-1.15c-.16.29-.34.67-.47.98a13.7 13.7 0 0 0-4.32 0c-.13-.31-.32-.69-.47-.98A14.9 14.9 0 0 0 7.7 5.15C3.82 10.95 2.8 16.61 3.32 22.21a15 15 0 0 0 4.54 2.3q.55-.74.96-1.58a9.8 9.8 0 0 1-1.51-.73c.13-.1.25-.2.37-.3a10.6 10.6 0 0 0 10.64 0c.12.1.24.2.37.3q-.59.37-1.51.73c.41.84.81 1.63.96 1.58a15 15 0 0 0 4.54-2.3c.6-6.42-.9-12.08-4.52-17.06zM9 17c-.9 0-1.63-.82-1.63-1.82S8.1 13.36 9 13.36s1.63.82 1.63 1.82S9.9 17 9 17zm6 0c-.9 0-1.63-.82-1.63-1.82s.73-1.82 1.63-1.82 1.63.82 1.63 1.82S15.9 17 15 17z" />
      </svg>
    )
  },
  {
    name: 'WHATSAPP',
    desc: 'Instant drop alerts and exclusive offers',
    linkText: 'JOIN GROUP',
    url: 'https://whatsapp.com',
    icon: (
      <svg viewBox="0 0 24 24" className="social-svg-icon">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.725-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.019-5.117-2.877-6.98-1.858-1.862-4.339-2.887-6.987-2.888-5.442 0-9.87 4.42-9.874 9.867-.001 1.748.471 3.454 1.362 4.981L1.893 22.09l4.754-1.936zm10.743-7.467c-.29-.145-1.713-.846-1.978-.942-.265-.096-.458-.145-.65.145-.193.29-.747.942-.916 1.135-.168.193-.337.217-.627.072-1.39-.7-2.3-1.153-3.21-2.71-.24-.41.24-.38.687-1.27.073-.145.036-.265-.018-.373-.054-.108-.458-1.101-.626-1.507-.165-.397-.326-.343-.458-.35-.118-.006-.253-.007-.389-.007-.135 0-.356.05-.543.253-.187.203-.714.698-.714 1.701 0 1.004.73 1.973.83 2.11.1.137 1.4 2.137 3.39 3.003.473.205.843.328 1.13.42.476.15.91.13 1.25.08.384-.057 1.713-.7 1.954-1.374.24-.674.24-1.253.168-1.374-.072-.12-.265-.193-.555-.338z" />
      </svg>
    )
  },
  {
    name: 'TELEGRAM',
    desc: 'Early release notifications',
    linkText: 'JOIN CHANNEL',
    url: 'https://telegram.org',
    icon: (
      <svg viewBox="0 0 24 24" className="social-svg-icon">
        <path d="M9.78 18.65l.28-4.28 7.68-6.95c.34-.3-.07-.46-.52-.16L7.74 13.3 3.64 12c-.89-.27-.9-.89.18-1.3l16.03-6.18c.74-.27 1.39.18 1.13 1.35l-2.72 12.86c-.19.92-.74 1.15-1.5.72l-4.14-3.05-2 1.93c-.22.22-.4.4-.82.4z" />
      </svg>
    )
  },
  {
    name: 'X (TWITTER)',
    desc: 'Latest updates and announcements',
    linkText: 'FOLLOW US',
    url: 'https://x.com',
    icon: (
      <svg viewBox="0 0 24 24" className="social-svg-icon">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    )
  },
  {
    name: 'SNAPCHAT',
    desc: 'Behind-the-scenes and exclusive looks',
    linkText: 'FOLLOW US',
    url: 'https://snapchat.com',
    icon: (
      <svg viewBox="0 0 24 24" className="social-svg-icon">
        <path d="M12 .024c-3.791 0-7.24 2.768-7.24 6.786 0 1.932 1.161 3.593 1.836 4.364.125.143.088.375-.081.472-.619.356-1.52.923-2.128 1.488-.707.659-.974 1.336-.974 2.052 0 .979.721 1.761 1.701 1.897.106.015.176.113.155.218-.04.205-.184.975-.184 1.411 0 1.25.992 2.083 2.155 2.083.582 0 1.189-.208 1.547-.43.146-.09.336-.024.402.137.42 1.026 1.439 1.517 2.807 1.517 1.366 0 2.386-.491 2.807-1.517.066-.16.256-.227.402-.137.358.222.965.43 1.547.43 1.163 0 2.155-.833 2.155-2.083 0-.436-.145-1.206-.184-1.411-.021-.106.049-.203.155-.218 1.002-.142 1.701-.918 1.701-1.897 0-.716-.267-1.393-.974-2.052-.608-.565-1.509-1.132-2.128-1.488-.169-.097-.206-.329-.081-.472.675-.771 1.836-2.432 1.836-4.364 0-4.018-3.449-6.786-7.24-6.786z" />
      </svg>
    )
  }
];

const lyricsData = [
  { time: 0, text: "" },
  { time: 5, text: "The velvet gates remain unmoved," },
  { time: 15, text: "A language that the stars disproved." },
  { time: 20, text: "An inkwell for the lonely few," },
  { time: 28, text: "To catch the shade of what was true." },
  { time: 33, text: "Not made for everyone..." },
  { time: 38, text: "(Not made for everyone...)" },
  { time: 42, text: "A path of obsidian and glass," },
  { time: 50, text: "Where only shadows find the pass." },
  { time: 70, text: "A thirst for what the light denies," },
  { time: 90, text: "Beneath these hollow, ancient skies." },
  { time: 94, text: "Not made for everyone..." },
  { time: 97, text: "(Whispered) not made for everyone." }
];

const Community = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef(null);
  const sectionRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const lyricLineRefs = useRef([]);

  // Setup refs for scrolling lyrics
  if (lyricLineRefs.current.length !== lyricsData.length) {
    lyricLineRefs.current = Array(lyricsData.length)
      .fill(null)
      .map((_, i) => lyricLineRefs.current[i] || null);
  }

  // Attempt to autoplay when user reaches the section (scrolls to view)
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let hasAutoplayed = false;

    const startPlay = () => {
      const audio = audioRef.current;
      if (!audio) return;

      // Try playing unmuted first
      audio.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // If unmuted autoplay is blocked by browser policy, fallback to muted play
          console.log("Unmuted autoplay blocked. Falling back to muted autoplay...");
          audio.muted = true;
          setIsMuted(true);
          audio.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch((err) => {
              console.log("Autoplay failed completely:", err);
              setIsPlaying(false);
            });
        });
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoplayed) {
          hasAutoplayed = true;
          startPlay();
          observer.unobserve(section);
        }
      },
      {
        threshold: 0.1 // Play when 10% of the section is visible
      }
    );

    observer.observe(section);

    // Global listener to unmute & play audio on first user interaction anywhere on the page
    const handleFirstInteraction = () => {
      const audio = audioRef.current;
      if (audio) {
        if (audio.muted) {
          audio.muted = false;
          setIsMuted(false);
        }
        if (audio.paused && hasAutoplayed) {
          audio.play()
            .then(() => setIsPlaying(true))
            .catch(() => {});
        }
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      observer.disconnect();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Find active lyric line index based on current time
  let activeIndex = 0;
  for (let i = 0; i < lyricsData.length; i++) {
    if (currentTime >= lyricsData[i].time) {
      activeIndex = i;
    }
  }

  // Center active lyric line with smooth scrolling
  useEffect(() => {
    const activeElement = lyricLineRefs.current[activeIndex];
    const container = lyricsContainerRef.current;
    if (activeElement && container) {
      const containerHeight = container.clientHeight;
      const elementOffsetTop = activeElement.offsetTop;
      const elementHeight = activeElement.clientHeight;

      container.scrollTo({
        top: elementOffsetTop - containerHeight / 2 + elementHeight / 2,
        behavior: 'smooth'
      });
    }
  }, [activeIndex]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log("Failed to play", e));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleLyricClick = (time) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
    if (!isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log("Failed to play on skip", e));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for joining the Inner Circle!');
  };

  const duration = audioRef.current ? audioRef.current.duration : 0;
  const progressPercent = audioRef.current && !isNaN(duration) && duration > 0 
    ? (currentTime / duration) * 100 
    : 0;

  return (
    <section className="community-section" ref={sectionRef}>
      {/* Newsletter Signup Banner & Lyric Player */}
      <div className="newsletter-banner">
        <div className="banner-bg-img-wrapper">
          <img src="/images/ComBack.png" alt="Gothic Moon Background" className="banner-bg-img" />
          <div className="banner-overlay"></div>
        </div>

        <div className="banner-content container banner-grid">
          {/* Left Column - Community Newsletter Signup */}
          <div className="banner-left-col">
            <p className="banner-join">JOIN THE</p>
            <h2 className="banner-title">UNICORN COMMUNITY</h2>
            <p className="banner-subtitle">
              Be the first to know about limited drops, exclusive collections,<br />
              special offers, and everything happening in the world of Unicorn.
            </p>

            <form className="banner-form" onSubmit={handleSubmit}>
              <div className="input-with-icon">
                <FiMail className="mail-icon" />
                <input
                  type="email"
                  placeholder="Enter your email address"
                  required
                  className="banner-input"
                />
              </div>
              <button type="submit" className="banner-btn">
                JOIN THE INNER CIRCLE <FiArrowRight className="arrow-icon" />
              </button>
            </form>

            <div className="banner-disclaimer">
              <FiShield className="shield-icon" />
              <span>No spam. Only exclusive updates. Unsubscribe anytime.</span>
            </div>
          </div>

          {/* Right Column - Music Player & Scroll Lyrics */}
          <div className="banner-right-col">
            <div className="lyrics-player-card">
              <div className="player-header">
                <div className="header-meta">
                  <FiMusic className="music-note-icon" />
                  <span className="player-title">VELVET GATES - THEME</span>
                </div>
                
                {/* Visualizer bars that pulse when playing */}
                <div className={`music-visualizer ${isPlaying ? 'playing' : ''}`}>
                  <span className="bar bar-1"></span>
                  <span className="bar bar-2"></span>
                  <span className="bar bar-3"></span>
                  <span className="bar bar-4"></span>
                </div>
              </div>

              {/* Lyrics Scroll Window */}
              <div className="lyrics-scroll-container" ref={lyricsContainerRef}>
                <div className="lyrics-scroll-spacer-top"></div>
                {lyricsData.map((lyric, idx) => {
                  if (lyric.text === "") return null;
                  const isActive = idx === activeIndex;
                  return (
                    <p
                      key={idx}
                      ref={el => lyricLineRefs.current[idx] = el}
                      className={`lyric-line ${isActive ? 'active' : ''}`}
                      onClick={() => handleLyricClick(lyric.time)}
                    >
                      {lyric.text}
                    </p>
                  );
                })}
                <div className="lyrics-scroll-spacer-bottom"></div>
              </div>

              {/* Player Controls */}
              <div className="player-controls">
                <button 
                  className="control-btn play-pause-btn" 
                  onClick={togglePlay} 
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <FiPause /> : <FiPlay />}
                </button>
                <div className="waveform-progress">
                  <div className="progress-bar-bg">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <span className="time-display">
                    {Math.floor(currentTime / 60)}:{(Math.floor(currentTime % 60)).toString().padStart(2, '0')}
                  </span>
                </div>
                <button 
                  className="control-btn mute-btn" 
                  onClick={toggleMute} 
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <FiVolumeX /> : <FiVolume2 />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio Node */}
      <audio
        ref={audioRef}
        src="/mp3/Velvet_Gates.mp4"
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Social Connection Cards */}
      <div className="social-connect container">
        <div className="social-header">
          <h3 className="social-title">CONNECT WITH THE COMMUNITY</h3>
          <div className="social-header-line"></div>
        </div>

        <div className="social-grid">
          {socialCards.map((card, idx) => (
            <a
              href={card.url}
              key={idx}
              target="_blank"
              rel="noopener noreferrer"
              className="social-card"
            >
              <div className="card-icon-wrapper">
                {card.icon}
              </div>
              <h4 className="card-name">{card.name}</h4>
              <p className="card-desc">{card.desc}</p>
              <div className="card-link">
                {card.linkText} <FiArrowRight className="arrow-icon" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Community;
