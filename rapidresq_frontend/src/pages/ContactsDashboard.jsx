import React from 'react';
import { Phone, Users, Shield, Ambulance } from 'lucide-react';

const ContactCard = ({ name, role, phone, icon: Icon, colorClass }) => (
  <div className={`bg-white p-6 rounded-lg shadow-md border-t-4 ${colorClass} flex items-center space-x-4`}>
    <div className={`p-3 rounded-full ${colorClass.replace('border-', 'bg-').replace('500', '100')} text-${colorClass.replace('border-', '').replace('500', '600')}`}>
      <Icon className="w-8 h-8" />
    </div>
    <div>
      <h3 className="text-xl font-bold text-gray-800">{name}</h3>
      <p className="text-sm font-medium text-gray-500">{role}</p>
      <p className="text-lg font-bold text-gray-900 mt-1">{phone}</p>
    </div>
  </div>
);

const ContactsDashboard = () => {
  const contacts = [
    { name: 'National Emergency', role: 'General Emergency', phone: '112', icon: Phone, color: 'border-red-500' },
    { name: 'Disaster Management', role: 'NDRF Control Room', phone: '1078', icon: Shield, color: 'border-blue-500' },
    { name: 'Ambulance', role: 'Medical Emergency', phone: '108', icon: Ambulance, color: 'border-green-500' },
    { name: 'Dr. Sarah', role: 'Chief Medical Officer', phone: '+91 98765 43210', icon: Users, color: 'border-purple-500' },
    { name: 'Capt. Rajesh', role: 'Rescue Operations Lead', phone: '+91 99887 76655', icon: Shield, color: 'border-blue-500' },
    { name: 'Local Police', role: 'City Police Control', phone: '100', icon: Phone, color: 'border-gray-800' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Important Contacts</h2>
        <p className="text-gray-500 mt-2">Key personnel and helplines for disaster management and rescue operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact, idx) => (
          <ContactCard 
            key={idx}
            name={contact.name}
            role={contact.role}
            phone={contact.phone}
            icon={contact.icon}
            colorClass={contact.color}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactsDashboard;
