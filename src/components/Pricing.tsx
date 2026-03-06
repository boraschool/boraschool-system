import { Check } from 'lucide-react';
import { Button } from './Button';

const plans = [
  {
    name: 'Basic',
    price: '$49',
    description: 'Perfect for small private schools.',
    features: [
      'Up to 500 Students',
      'Unlimited Exams',
      'Basic Analytics',
      'Email Support',
      'Standard Security',
    ],
    cta: 'Start with Basic',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$99',
    description: 'Best for growing institutions.',
    features: [
      'Up to 2,000 Students',
      'Advanced Analytics',
      'AI-Assisted Grading',
      'Priority Support',
      'Custom Branding',
      'Parent Portal Access',
    ],
    cta: 'Get Started with Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large school networks.',
    features: [
      'Unlimited Students',
      'Multi-school Dashboard',
      'Dedicated Account Manager',
      'SLA Guarantee',
      'On-premise Options',
      'API Access',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-24 bg-white relative">
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none" style={{ backgroundImage: 'var(--background-kenya-pattern)', backgroundSize: '100px 100px' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-kenya-red font-semibold tracking-wide uppercase text-sm mb-3">Pricing</h2>
          <p className="text-4xl font-bold text-kenya-black mb-4">Simple, Transparent Pricing</p>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose the plan that fits your school's needs. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 rounded-3xl border ${
                plan.popular
                  ? 'border-kenya-green shadow-xl shadow-kenya-green/10 ring-1 ring-kenya-green'
                  : 'border-gray-100 shadow-sm'
              } bg-white transition-transform hover:scale-[1.02]`}
            >
              {plan.popular && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-kenya-green text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-kenya-black mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold text-kenya-black">{plan.price}</span>
                  {plan.price !== 'Custom' && <span className="text-gray-500">/month</span>}
                </div>
                <p className="text-gray-500 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="bg-kenya-green/10 p-1 rounded-full">
                      <Check className="w-3 h-3 text-kenya-green" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? 'primary' : 'outline'}
                className="w-full"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
