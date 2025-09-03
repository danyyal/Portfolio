import { useState, useEffect, type JSX } from 'react';
import {
  Box,
  Text,
  Button,
  Flex,
  VStack,
  HStack,
  Center,
  IconButton,
  Badge,
  Container,
} from '@chakra-ui/react';
import { Progress } from '@chakra-ui/progress'
import { Wrench, Zap, Clock, Sparkles, Code, Rocket } from 'lucide-react';
import CoolSparklesCenter from './CoolSparklesCenter';

interface MousePosition {
  x: number;
  y: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  opacity: number;
  angle: number;
  speed: number;
}

interface BackgroundParticle {
  id: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
}

const keyframes = `
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translateY(0px); }
    40%, 43% { transform: translateY(-10px); }
    70% { transform: translateY(-5px); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.2; }
    50% { opacity: 0.8; }
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

export default function UnderDevelopmentPage(): JSX.Element {
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });
  const [clickCount, setClickCount] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [currentIcon, setCurrentIcon] = useState<number>(0);

  const icons = [Wrench, Code, Zap, Rocket, Sparkles];
  const Icon = icons[currentIcon];

  // Background particles data
  const backgroundParticles: BackgroundParticle[] = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 2
  }));

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + Math.random() * 5));
      setCurrentIcon(prev => (prev + 1) % icons.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [icons.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(p => ({
          ...p,
          y: p.y - 2,
          x: p.x + Math.sin(p.y * 0.01) * 0.5,
          opacity: p.opacity - 0.02
        })).filter(p => p.opacity > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleInteraction = (e: any) => {
    setClickCount(prev => prev + 1);
    
    // Create particle burst
    const rect = e.currentTarget.getBoundingClientRect();
    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Math.random(),
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
      angle: (i * 45) * Math.PI / 180,
      speed: Math.random() * 13 + 2
    }));
    
    setParticles(prev => [...prev, ...newParticles]);
  };

  const handleSpeedUp = () => {
    setProgress(prev => Math.min(100, prev + 10));
  };

  const handleResetCounter = () => {
    setClickCount(0);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: keyframes }} />
      <Box
        minH="100vh"
        position="relative"
        overflow="hidden"
        bgGradient="linear(135deg, gray.900 0%, purple.700 50%, gray.900 100%)"
      >
        <Box
          position="absolute"
          inset="0"
          transition="all 300ms ease-out"
          background={`radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(139, 92, 246, 0.3) 0%, 
            rgba(59, 130, 246, 0.2) 25%, 
            rgba(16, 185, 129, 0.1) 50%, 
            transparent 70%)`}
        />
        
        {backgroundParticles.map(particle => (
          <Box
            key={particle.id}
            position="absolute"
            w="8px"
            h="8px"
            bg="white"
            borderRadius="50%"
            opacity="0.2"
            left={`${particle.left}%`}
            top={`${particle.top}%`}
            animation={`pulse ${particle.duration}s infinite ${particle.delay}s`}
          />
        ))}

        {/* Interactive Particles */}
        {particles.map(particle => (
          <Box
            key={particle.id}
            position="absolute"
            w="4px"
            h="4px"
            bg="yellow.400"
            borderRadius="50%"
            pointerEvents="none"
            left={`${particle.x}px`}
            top={`${particle.y}px`}
            opacity={particle.opacity}
            transform={`translate(${Math.cos(particle.angle) * particle.speed}px, ${Math.sin(particle.angle) * particle.speed}px)`}
          />
        ))}

        <Center minH="100vh" zIndex="10" position="relative" p={8}>
          <Container maxW="4xl">
            <VStack gap={8} textAlign="center">
              
              <Box position="relative">
                <IconButton
                  aria-label="Development Icon"
                  w="96px"
                  h="96px"
                  borderRadius="50%"
                  bgGradient="linear(135deg, purple.400 0%, blue.500 100%)"
                  cursor="pointer"
                  transition="all 300ms"
                  animation="bounce 2s infinite"
                  boxShadow={`0 0 ${20 + clickCount * 2}px rgba(139, 92, 246, 0.5)`}
                  _hover={{
                    transform: 'scale(1.1) rotate(12deg)'
                  }}
                  onClick={handleInteraction}
                >
                  <Icon 
                    color="white" 
                    style={{ 
                      fontSize:'64px',
                      animation: 'spin 3s linear infinite'
                    }} 
                  /> 
                </IconButton>
                {clickCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    bg="yellow.500"
                    color="black"
                    px={3}
                    py={1}
                    borderRadius="full"
                    fontSize="sm"
                    fontWeight="bold"
                    animation="bounce 1s infinite"
                  >
                    {clickCount} clicks!
                  </Badge>
                )}
              </Box>

              <VStack gap={4}>
                <Text
                  fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
                  color="gray.300"
                  animation="float 3s ease-in-out infinite"
                >
                  Something amazing is being crafted...
                </Text>
              </VStack>
              <CoolSparklesCenter />


              {/* Progress Section */}
              <VStack gap={1} w="full" maxW="md">
                <HStack color="gray.300" alignItems={'center'} gap={2}>
                  <Clock size={20} />
                  <Text mb={'0px'}>Development Progress</Text>
                </HStack>
                
                <Box w="full" position="relative">
                  <Progress
                    value={progress}
                    size="lg"
                    borderRadius="full"
                    bg="gray.800"
                    sx={{
                      '& > div': {
                        background: 'linear-gradient(135deg, #9f7aea 0%, #3182ce 100%)',
                        position: 'relative',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          inset: 0,
                          bg: 'whiteAlpha.200',
                          borderRadius: 'full',
                          animation: 'pulse 1s infinite'
                        }
                      }
                    }}
                  />
                </Box>
                
                <Text fontSize="sm" color="gray.400">
                  {Math.round(progress)}% Complete
                </Text>
              </VStack>

              <Flex flexWrap="wrap" justify="center" gap={4}>
                <Button
                  onClick={handleSpeedUp}
                  bg="purple.600"
                  color="white"
                  px={6}
                  py={6}
                  borderRadius="lg"
                  fontWeight="medium"
                  transition="all 300ms"
                  _hover={{
                    bg: 'purple.500',
                    transform: 'scale(1.05)',
                    boxShadow: 'lg'
                  }}
                >
                  Speed Up! ⚡
                </Button>
                <Button
                  onClick={handleResetCounter}
                  bg="blue.600"
                  color="white"
                  px={6}
                  py={6}
                  borderRadius="lg"
                  fontWeight="medium"
                  transition="all 300ms"
                  _hover={{
                    bg: 'blue.500',
                    transform: 'scale(1.05)',
                    boxShadow: 'lg'
                  }}
                >
                  Reset Counter 🔄
                </Button>
              </Flex>

              {/* Status Message */}
              <Box
                mt={8}
                p={6}
                borderRadius="2xl"
                border="1px solid"
                maxW="lg"
                bg="whiteAlpha.50"
                backdropFilter="blur(10px)"
                borderColor="whiteAlpha.100"
              >
                <Text color="gray.300" lineHeight="relaxed">
                  🚀 Working hard to bring you something incredible.
                  <br />
                  <Text as="span" color="purple.300">Stay tuned for updates!</Text>
                </Text>
              </Box>
            </VStack>
          </Container>
        </Center>
      </Box>
    </>
  );
}