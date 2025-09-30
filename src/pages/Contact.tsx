import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Linkedin, Github, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Contact = () => {
    useEffect(() => {
        document.title = 'Contact Us - RAIN Platform Team';
    }, []);

    const teamMembers = [
        {
            id: 1,
            name: 'Kashif Ali Khan',
            role: 'ML Developer',
            image: 'kashif.jpg',
            linkedin: 'https://www.linkedin.com/in/kashif-ali-khan-2812a316b',
            github: 'https://github.com/kashifalikhan36',
            email: 'kashifalikhan093@gmail.com'
        },
        {
            id: 2,
            name: 'Aman Verma',
            role: 'Backend Developer',
            image: 'aman.jpg',
            linkedin: 'https://www.linkedin.com/in/aman-verma403',
            github: 'https://github.com/tranquility404',
            email: 'amanverma404403@gmail.com'
        },
        {
            id: 3,
            name: 'Arichit Srivastava',
            role: 'Mobile App Developer',
            image: '/api/placeholder/300/300',
            linkedin: 'https://linkedin.com/in/amit-patel-dev',
            github: 'https://github.com/amit-patel-backend',
            email: 'arichitsrivastava159@gmail.com'
        },
        {
            id: 4,
            name: 'Dev Mangal Singh',
            role: 'Frontend Developer',
            image: '/api/placeholder/300/300',
            linkedin: 'https://linkedin.com/in/sneha-reddy-frontend',
            github: 'https://github.com/sneha-reddy-ui',
            email: 'deepgta222@gmail.com'
        },
        {
            id: 5,
            name: 'Abhay Raj Verma',
            role: 'Frontend Developer',
            image: '/api/placeholder/300/300',
            linkedin: 'https://linkedin.com/in/dr-arjun-mehta',
            github: 'https://github.com/arjun-mehta-research',
            email: 'abhayv183@gmail.com'
        },
        {
            id: 6,
            name: 'Saniya Khan',
            role: 'UI/UX Designer',
            image: '/api/placeholder/300/300',
            linkedin: 'https://linkedin.com/in/kavya-singh-data',
            github: 'https://github.com/kavya-singh-ml',
            email: 'sk4358555@gmail.com'
        }
    ];

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mt-32 mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-card-foreground">
                        Our{' '}
                        <span className="bg-gradient-eco bg-clip-text text-transparent">
                            Team
                        </span>
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Diverse expertise united by a common vision - transforming India's water landscape through innovation and community-driven solutions.
                    </p>
                </motion.div>

                {(() => {
                    // Grid configuration - easily adjustable
                    const gridConfig = {
                        sm: 1,
                        md: 2,
                        lg: 3,
                        xl: 3  // Change this to any number to adjust grid columns
                    };

                    const largestGrid = gridConfig.xl; // Use the largest breakpoint as reference
                    const totalMembers = teamMembers.length;
                    const completeRows = Math.floor(totalMembers / largestGrid);
                    const remainingMembers = totalMembers % largestGrid;
                    const membersInCompleteRows = completeRows * largestGrid;

                    return (
                        <>
                            {/* Complete rows */}
                            {membersInCompleteRows > 0 && (
                                <div className={`grid md:grid-cols-${gridConfig.md} lg:grid-cols-${gridConfig.lg} xl:grid-cols-${gridConfig.xl} gap-8`}>
                                    {teamMembers.slice(0, membersInCompleteRows).map((member, index) => (
                                        <motion.div
                                            key={member.id}
                                            initial={{ opacity: 0, y: 30 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 0.6, delay: index * 0.1 }}
                                        >
                                            <Card className="p-6 h-full glass border-white/20 shadow-glass hover:shadow-water transition-all duration-300 group">
                                                {/* Profile Image */}
                                                <div className="relative mb-4">
                                                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-water p-1">
                                                        <img
                                                            src={member.image}
                                                            alt={member.name}
                                                            className="w-full h-full rounded-full object-cover bg-muted"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Member Info */}
                                                <div className="text-center mb-4">
                                                    <h3 className="text-lg font-bold text-card-foreground mb-1">
                                                        {member.name}
                                                    </h3>
                                                    <p className="text-sm font-medium text-primary mb-2">
                                                        {member.role}
                                                    </p>
                                                </div>

                                                {/* Social Links */}
                                                <div className="flex justify-center space-x-3 mb-4">
                                                    <a
                                                        href={member.linkedin}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-500/20 transition-colors"
                                                        aria-label={`${member.name}'s LinkedIn`}
                                                    >
                                                        <Linkedin className="w-4 h-4" />
                                                    </a>
                                                    <a
                                                        href={member.github}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="w-8 h-8 bg-gray-500/10 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-500/20 transition-colors"
                                                        aria-label={`${member.name}'s GitHub`}
                                                    >
                                                        <Github className="w-4 h-4" />
                                                    </a>
                                                    <a
                                                        href={`mailto:${member.email}`}
                                                        className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                                                        aria-label={`Email ${member.name}`}
                                                    >
                                                        <Mail className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Remaining members - centered */}
                            {remainingMembers > 0 && (
                                <div className="flex justify-center mt-8">
                                    <div className={`grid gap-8 ${remainingMembers === 1 ? 'grid-cols-1 max-w-sm' :
                                            remainingMembers === 2 ? 'md:grid-cols-2 max-w-2xl' :
                                                remainingMembers === 3 ? 'md:grid-cols-2 lg:grid-cols-3 max-w-4xl' :
                                                    'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl'
                                        }`}>
                                        {teamMembers.slice(membersInCompleteRows).map((member, index) => (
                                            <motion.div
                                                key={member.id}
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.6, delay: (membersInCompleteRows + index) * 0.1 }}
                                            >
                                                <Card className="p-6 h-full glass border-white/20 shadow-glass hover:shadow-water transition-all duration-300 group">
                                                    {/* Profile Image */}
                                                    <div className="relative mb-4">
                                                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gradient-water p-1">
                                                            <img
                                                                src={member.image}
                                                                alt={member.name}
                                                                className="w-full h-full rounded-full object-cover bg-muted"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Member Info */}
                                                    <div className="text-center mb-4">
                                                        <h3 className="text-lg font-bold text-card-foreground mb-1">
                                                            {member.name}
                                                        </h3>
                                                        <p className="text-sm font-medium text-primary mb-2">
                                                            {member.role}
                                                        </p>
                                                    </div>

                                                    {/* Social Links */}
                                                    <div className="flex justify-center space-x-3 mb-4">
                                                        <a
                                                            href={member.linkedin}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 hover:bg-blue-500/20 transition-colors"
                                                            aria-label={`${member.name}'s LinkedIn`}
                                                        >
                                                            <Linkedin className="w-4 h-4" />
                                                        </a>
                                                        <a
                                                            href={member.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="w-8 h-8 bg-gray-500/10 rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-500/20 transition-colors"
                                                            aria-label={`${member.name}'s GitHub`}
                                                        >
                                                            <Github className="w-4 h-4" />
                                                        </a>
                                                        <a
                                                            href={`mailto:${member.email}`}
                                                            className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary hover:bg-primary/20 transition-colors"
                                                            aria-label={`Email ${member.name}`}
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                        </a>
                                                    </div>
                                                </Card>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    );
                })()}
            </div>

            <Footer />
        </div>
    );
};

export default Contact;