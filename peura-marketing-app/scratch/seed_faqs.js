const axios = require('axios');

const initialFaqs = [
  {
    question: "How do I choose the right frame size for my face?",
    answer: "The easiest way is to look at the numbers inside the temple of your current glasses. If those fit well, match those dimensions. Alternatively, use our Virtual Try-On tool which uses AR to measure your face proportions in real-time.",
    category: "Style"
  },
  {
    question: "What is Peura's shipping policy?",
    answer: "We offer free standard shipping on all orders over ₹999. Delivery typically takes 3-5 business days across major cities in India. You will receive a tracking link via WhatsApp and email as soon as your order is dispatched.",
    category: "Shipping"
  }
];

const API_URL = 'http://localhost:5000';

async function seed() {
  for (const faq of initialFaqs) {
    try {
      await axios.post(`${API_URL}/api/faq/create`, faq);
      console.log('Seeded FAQ:', faq.question);
    } catch (e) {
      console.error('Failed to seed:', e.message);
    }
  }
}

seed();
