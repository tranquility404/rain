import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card } from '@/components/ui/card';

const ReviewsSection = () => {
  const reviews = [
    {
      name: 'Sarah Johnson',
      location: 'Austin, TX',
      rating: 5,
      text: 'AquaHarvest transformed our water usage completely! We\'ve reduced our water bill by 65% and love contributing to sustainability. The installation was seamless.',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    {
      name: 'Michael Chen',
      location: 'Phoenix, AZ',
      rating: 5,
      text: 'The AI analysis was incredibly accurate. The team recommended the perfect system for our roof, and the results exceeded our expectations. Highly recommend!',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    {
      name: 'Emily Rodriguez',
      location: 'San Diego, CA',
      rating: 5,
      text: 'From consultation to installation, everything was professional and efficient. The mobile app makes monitoring our water collection so easy. Great investment!',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    },
    {
      name: 'David Wilson',
      location: 'Denver, CO',
      rating: 5,
      text: 'We\'ve collected over 3,000 gallons in just the first month! The system pays for itself, and we feel great about reducing our environmental impact.',
      avatar: 'https://randomuser.me/api/portraits/men/79.jpg',
    },
    {
      name: 'Lisa Thompson',
      location: 'Portland, OR',
      rating: 5,
      text: 'The customer support is outstanding. They guided us through every step and continue to provide excellent maintenance service. Best decision we\'ve made!',
      avatar: 'https://randomuser.me/api/portraits/women/25.jpg',
    },
    {
      name: 'James Park',
      location: 'Seattle, WA',
      rating: 5,
      text: 'Installation was completed in just one day with minimal disruption. The quality of materials and workmanship is top-notch. Couldn\'t be happier!',
      avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
    },
  ];

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            }`}
        />
      ))}
    </div>
  );

  return (
    <section id="reviews" className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-card-foreground">
            What Our{' '}
            <span className="bg-gradient-water bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what real customers have to say about their AquaHarvest experience.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full glass border-white/20 shadow-glass hover:shadow-water transition-all duration-300 relative">
                <Quote className="absolute top-4 right-4 w-8 h-8 text-primary/20" />

                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4 border-2 border-white/20">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-card-foreground">{review.name}</h4>
                    <p className="text-sm text-muted-foreground">{review.location}</p>
                  </div>
                </div>

                <StarRating rating={review.rating} />

                <p className="text-muted-foreground mt-4 leading-relaxed">
                  "{review.text}"
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;