import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Collection {
  constructor(name) {
    this.filePath = path.join(DATA_DIR, `${name}.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  read() {
    try {
      const data = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading database file ${this.filePath}:`, error);
      return [];
    }
  }

  write(data) {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing database file ${this.filePath}:`, error);
    }
  }

  async find(query = {}) {
    let items = this.read();
    
    // Filter
    for (const key in query) {
      if (query[key] !== undefined) {
        if (typeof query[key] === 'object' && query[key] !== null) {
          // simple handling for regex search or operators
          if (query[key].$regex) {
            const regex = new RegExp(query[key].$regex, query[key].$options || 'i');
            items = items.filter(item => regex.test(item[key]));
          }
        } else {
          items = items.filter(item => item[key] === query[key]);
        }
      }
    }
    
    // Sort descending by default for createdAt
    items.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return dateB - dateA;
    });

    return items;
  }

  async findOne(query = {}) {
    const items = await this.find(query);
    return items[0] || null;
  }

  async findById(id) {
    const items = this.read();
    return items.find(item => item._id === id || item.id === id) || null;
  }

  async create(data) {
    const items = this.read();
    const newItem = {
      _id: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    this.write(items);
    return newItem;
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const items = this.read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;

    const updatedItem = {
      ...items[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    items[index] = updatedItem;
    this.write(items);
    return updatedItem;
  }

  async findByIdAndDelete(id) {
    const items = this.read();
    const index = items.findIndex(item => item._id === id || item.id === id);
    if (index === -1) return null;

    const deletedItem = items[index];
    const newItems = items.filter(item => item._id !== id && item.id !== id);
    this.write(newItems);
    return deletedItem;
  }

  async countDocuments(query = {}) {
    const items = await this.find(query);
    return items.length;
  }
}

export const getCollection = (name) => {
  return new Collection(name);
};
