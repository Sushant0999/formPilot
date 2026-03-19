import { faker } from '@faker-js/faker';

export interface FieldMapping {
  [key: string]: string; // key: field name/id/placeholder, value: faker method string
}

const defaultMapping: FieldMapping = {
  'name': 'person.fullName',
  'fullName': 'person.fullName',
  'firstName': 'person.firstName',
  'lastName': 'person.lastName',
  'email': 'internet.email',
  'password': 'internet.password',
  'phone': 'phone.number',
  'tel': 'phone.number',
  'address': 'location.streetAddress',
  'street': 'location.streetAddress',
  'city': 'location.city',
  'country': 'location.country',
  'zip': 'location.zipCode',
  'company': 'company.name',
  'username': 'internet.userName',
  'description': 'lorem.sentence',
  'bio': 'lorem.paragraph',
  'website': 'internet.url',
  'url': 'internet.url',
};

// Heuristic to match field to faker method
export const getFakerValue = (fieldInfo: { type: string; name: string; id: string; placeholder: string }, customMapping: FieldMapping = {}) => {
  const mapping = { ...defaultMapping, ...customMapping };
  const { type, name, id, placeholder } = fieldInfo;

  // 1. Try to match by name/id/placeholder using mapping keys
  const searchStrings = [name, id, placeholder].map(s => s.toLowerCase());
  
  for (const [key, fakerMethod] of Object.entries(mapping)) {
    if (searchStrings.some(s => s.includes(key.toLowerCase()))) {
      return executeFaker(fakerMethod);
    }
  }

  // 2. Try to match by type
  if (type === 'email') return faker.internet.email();
  if (type === 'tel') return faker.phone.number();
  if (type === 'url') return faker.internet.url();
  if (type === 'password') return faker.internet.password();
  if (type === 'number') return faker.number.int({ min: 1, max: 100 }).toString();
  if (type === 'date') return faker.date.past().toISOString().split('T')[0];

  // Default to a word or sentence for text inputs
  return faker.lorem.word();
};

const executeFaker = (methodPath: string) => {
  try {
    const parts = methodPath.split('.');
    let fn: any = faker;
    for (const part of parts) {
      fn = fn[part as keyof typeof fn];
    }
    return typeof fn === 'function' ? fn() : fn;
  } catch (e) {
    console.error('Faker execution error:', e);
    return faker.lorem.word();
  }
};
