import { motion } from 'framer-motion';
import { CheckCircle, Clock, Target, Lightbulb, Network, Users, Droplets, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const ProjectProgressSection = () => {
    const completedFeatures = [
        {
            icon: Droplets,
            title: 'Rainfall Data Analysis',
            description: 'Comprehensive rainfall pattern analysis with historical data integration',
            status: 'completed'
        },
        {
            icon: Zap,
            title: 'Groundwater Assessment',
            description: 'Real-time groundwater level monitoring and analysis system',
            status: 'completed'
        },
        {
            icon: CheckCircle,
            title: 'Runoff Capacity Calculator',
            description: 'AI-powered surface runoff potential measurement and optimization',
            status: 'completed'
        },
        {
            icon: Target,
            title: 'Dimension Analysis',
            description: 'Intelligent rooftop and land analysis for optimal system placement',
            status: 'completed'
        }
    ];

    const additionalFeatures = [
        {
            icon: Users,
            title: 'Contractor Marketplace',
            description: 'Verified professionals network with integrated project management system for seamless installation coordination',
            status: 'pipeline'
        },
        {
            icon: Network,
            title: 'Installation Tracking',
            description: 'Real-time project monitoring and quality assurance system from start to completion',
            status: 'pipeline'
        },
        {
            icon: Lightbulb,
            title: 'Cost Analysis Engine',
            description: 'Dynamic pricing with comprehensive ROI analysis and flexible financing options',
            status: 'pipeline'
        }
    ];

    const futureVision = [
        {
            icon: Network,
            title: 'Interconnected Water Hubs',
            description: 'Building a network of connected water harvesting systems across India',
            impact: 'National Scale'
        },
        {
            icon: Users,
            title: 'Community Water Sharing',
            description: 'Peer-to-peer water sharing system during scarcity periods',
            impact: 'Community Impact'
        },
        {
            icon: Droplets,
            title: 'Predictive Water Management',
            description: 'AI-driven water demand forecasting and distribution optimization',
            impact: 'Smart Cities'
        }
    ];

    return (
        <section id='project-progress' className="py-20 bg-gradient-to-br from-background via-muted/20 to-background">
            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-card-foreground">
                        Project{' '}
                        <span className="bg-gradient-water bg-clip-text text-transparent">
                            Progress
                        </span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Building India's comprehensive water independence platform - from completed solutions to future innovations
                    </p>
                </motion.div>

                {/* What's Working */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <CheckCircle className="w-8 h-8 text-secondary" />
                        <h3 className="text-3xl font-bold text-card-foreground">What's Working</h3>
                        <Badge variant="secondary" className="ml-2">Live Now</Badge>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {completedFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-6 h-full glass border-white/20 shadow-glass hover:shadow-water transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-gradient-to-r from-secondary to-secondary/80 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-card-foreground">{feature.title}</h4>
                                        <CheckCircle className="w-4 h-4 text-secondary" />
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Continuous Improvements */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-8"
                    >
                        <Card className="p-6 glass border-white/20 shadow-glass">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5 text-secondary" />
                                    Continuous Improvements
                                </h4>
                                <Badge variant="outline" className="text-xs bg-secondary/10 text-secondary border-secondary/20">70% Complete</Badge>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2 mb-4">
                                <motion.div
                                    className="bg-gradient-to-r from-secondary to-secondary/80 h-2 rounded-full"
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '70%' }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, delay: 0.3 }}
                                />
                            </div>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <strong className="text-card-foreground">Smart Image Analysis:</strong> Replacing manual roof height & width input with AI-powered image prediction to simplify the user process.
                                    </p>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-2 h-2 bg-secondary rounded-full mt-2 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <strong className="text-card-foreground">Simplified Dashboard:</strong> Streamlining analysis dashboard to prevent information overload and improve user experience.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Community Impact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="mt-6"
                    >
                        <Card className="p-6 glass border-white/20 shadow-glass">
                            <h4 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-secondary" />
                                Growing Community Impact
                            </h4>
                            <div className="flex items-center justify-between">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-secondary">200+</div>
                                    <div className="text-sm text-muted-foreground">Active Users</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-secondary">100%</div>
                                    <div className="text-sm text-muted-foreground">Feedback Integration</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-secondary">Live</div>
                                    <div className="text-sm text-muted-foreground">Self Assessment</div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Additional Features */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Clock className="w-8 h-8 text-primary" />
                        <h3 className="text-3xl font-bold text-card-foreground">Additional Features</h3>
                        <Badge variant="outline" className="ml-2">Completing the Pipeline</Badge>
                    </div>
                    <p className="text-lg text-muted-foreground mb-8 text-center max-w-3xl mx-auto">
                        Integrating comprehensive features to complete the pipeline from analysis to execution, ensuring seamless user experience throughout the entire water harvesting journey.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        {additionalFeatures.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-6 h-full glass border-white/20 shadow-glass hover:shadow-water transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-gradient-water rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-card-foreground">{feature.title}</h4>
                                        <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">Pipeline</Badge>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {feature.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    {/* Additional Initiatives */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="mt-8"
                    >
                        <Card className="p-6 glass border-white/20 shadow-glass">
                            <h4 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-primary" />
                                Strategic Initiatives
                            </h4>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-card-foreground mb-1">Government Partnerships</p>
                                            <p className="text-sm text-muted-foreground">
                                                Actively engaging with authorities to establish partnerships and secure funding for nationwide implementation.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                                        <div>
                                            <p className="font-medium text-card-foreground mb-1">User Base Expansion</p>
                                            <p className="text-sm text-muted-foreground">
                                                Growing our community through continuous feedback integration and platform improvements based on user insights.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* Our Vision */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <div className="flex items-center gap-3 mb-8">
                        <Target className="w-8 h-8 text-accent" />
                        <h3 className="text-3xl font-bold text-card-foreground">Our Vision</h3>
                        <Badge variant="outline" className="ml-2 bg-gradient-eco text-white border-none">Future</Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {futureVision.map((vision, index) => (
                            <motion.div
                                key={vision.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="p-6 h-full glass border-white/20 shadow-glass hover:shadow-eco transition-all duration-300 group">
                                    <div className="w-12 h-12 bg-gradient-eco rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <vision.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold text-card-foreground">{vision.title}</h4>
                                        <Badge variant="secondary" className="text-xs">{vision.impact}</Badge>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed">
                                        {vision.description}
                                    </p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Vision Statement */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="mt-16 text-center"
                >
                    <Card className="p-8 glass border-white/20 shadow-glass max-w-4xl mx-auto">
                        <div className="text-2xl md:text-3xl font-bold mb-6 text-card-foreground leading-relaxed">
                            "Building a{' '}
                            <span className="bg-gradient-water bg-clip-text text-transparent">
                                self-sustaining network
                            </span>{' '}
                            of interconnected water hubs across India, where every drop of rain is captured, shared, and optimized for{' '}
                            <span className="bg-gradient-eco bg-clip-text text-transparent">
                                collective water security
                            </span>
                            ."
                        </div>
                        <p className="text-xl text-muted-foreground">
                            Transforming individual installations into a nationwide water independence movement
                        </p>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
};

export default ProjectProgressSection;