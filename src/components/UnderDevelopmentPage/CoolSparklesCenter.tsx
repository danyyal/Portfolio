import { useState, useEffect, useRef } from 'react';
import { Sparkles, Zap, Star } from 'lucide-react';

export default function CoolSparklesCenter() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<{
    id: number;
    x: number;
    y: number;
    delay: number;
    duration: number;
}[]>([]);
  const mainCircleRef = useRef<any>(null);

  // Create background particles
  useEffect(() => {
    const particleArray = [];
    for (let i = 0; i < 50; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 4,
      });
    }
    setParticles(particleArray);
  }, []);

  const handleMouseMove = (e:any) => {
    if (!mainCircleRef.current) return;
    
    const rect = mainCircleRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateY = (mouseX / rect.width) * 20;
    const rotateX = -(mouseY / rect.height) * 20;
    
    setMousePos({ x: rotateY, y: rotateX });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  const floatingIcons = [
    { Icon: Star, color: '#F59E0B', size: 20, position: { top: '20px', left: '50%', transform: 'translateX(-50%)' }, delay: 0 },
    { Icon: Zap, color: '#10B981', size: 22, position: { top: '50%', right: '20px', transform: 'translateY(-50%)' }, delay: -1 },
    { Icon: Sparkles, color: '#EC4899', size: 16, position: { bottom: '20px', left: '50%', transform: 'translateX(-50%)' }, delay: -2 },
    { Icon: Star, color: '#8B5CF6', size: 24, position: { top: '50%', left: '20px', transform: 'translateY(-50%)' }, delay: -1.5 },
    { Icon: Zap, color: '#06B6D4', size: 14, position: { top: '60px', right: '60px' }, delay: -0.5 },
    { Icon: Sparkles, color: '#F97316', size: 18, position: { bottom: '60px', left: '60px' }, delay: -2.5 },
  ];

  return (
 <>
      {/* Background Particles */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -2,
      }}>
        {particles.map((particle) => (
          <div
            key={particle.id}
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: 'rgba(139, 92, 246, 0.6)',
              borderRadius: '50%',
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animation: `twinkle ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 0 30px rgba(139, 92, 246, 0.4);
          }
          50% { 
            box-shadow: 0 0 60px rgba(139, 92, 246, 0.7);
          }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes rotate-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-20px) rotate(0deg); }
          75% { transform: translateY(-10px) rotate(-5deg); }
        }

        @keyframes float-orbit {
          0%, 100% { 
            transform: translateY(0px) scale(1);
            opacity: 0.8;
          }
          50% { 
            transform: translateY(-25px) scale(1.2);
            opacity: 1;
          }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1); }
        }

        .main-circle {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .main-circle::before {
          content: '';
          position: absolute;
          inset: -10px;
          border-radius: 50%;
          background: conic-gradient(from 0deg, 
            transparent, 
            rgba(139, 92, 246, 0.8), 
            transparent, 
            rgba(168, 85, 247, 0.6), 
            transparent);
          animation: rotate 8s linear infinite;
          z-index: -1;
          opacity: 0.7;
        }

        .main-circle::after {
          content: '';
          position: absolute;
          inset: -5px;
          border-radius: 50%;
          background: radial-gradient(circle, transparent 70%, rgba(139, 92, 246, 0.3));
          animation: rotate-reverse 6s linear infinite;
          z-index: -1;
        }

        .sparkles-icon {
          animation: float 4s ease-in-out infinite;
          z-index: 2;
        }

        .floating-icon {
          animation: float-orbit 6s ease-in-out infinite;
          opacity: 0.8;
        }
      `}</style>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
      }}>
        <div
          ref={mainCircleRef}
          className="main-circle"
          style={{
            position: 'relative',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `radial-gradient(circle at center, 
              rgba(139, 92, 246, 0.3) 0%, 
              rgba(79, 70, 229, 0.2) 40%, 
              rgba(0, 0, 0, 0.4) 100%)`,
            border: '3px solid rgba(139, 92, 246, 0.5)',
            backdropFilter: 'blur(15px)',
            cursor: 'pointer',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: isHovered 
              ? `scale(1.1) rotateX(${mousePos.y}deg) rotateY(${mousePos.x}deg)`
              : 'scale(1) rotateX(0deg) rotateY(0deg)',
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
        >
          {/* Central Sparkles Icon */}
          <div
            className="sparkles-icon"
            style={{
              transition: 'all 0.3s ease',
              transform: isHovered ? 'scale(1.3) rotate(15deg)' : 'scale(1) rotate(0deg)',
              filter: isHovered ? 'drop-shadow(0 0 20px rgba(214, 188, 250, 0.8))' : 'none',
            }}
          >
            <Sparkles size={64} color="#D6BCFA" />
          </div>

          {/* Floating Icons */}
          <div style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
          }}>
            {floatingIcons.map(({ Icon, color, size, position, delay }, index) => (
              <div
                key={index}
                className="floating-icon"
                style={{
                  position: 'absolute',
                  ...position,
                  animationDelay: `${delay}s`,
                  animationDuration: isHovered ? '3s' : '6s',
                  transform: isHovered 
                    ? `${position.transform || ''} scale(1.2)`
                    : position.transform || '',
                }}
              >
                <Icon size={size} color={color} />
              </div>
            ))}
          </div>
        </div>
      </div>
      </>
  );
}