'use server'

import { handleError } from '../utils';
import { connectToDatabase } from '../database';
import Person from '../database/models/people.model';


interface PersonData {
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumbers: string[];
  organizationId: string;
  position: string;
}

export const createPerson = async (personData: PersonData) => {
  try {
    await connectToDatabase();

    const newPerson = await Person.create(personData);

    return JSON.parse(JSON.stringify(newPerson));
  } catch (error) {
    handleError(error);
  }
};

export const getPersonById = async (personId: string) => {
  try {
    await connectToDatabase();

    const person = await Person.findById(personId);

    if (!person) {
      throw new Error('Person not found');
    }

    return JSON.parse(JSON.stringify(person));
  } catch (error) {
    handleError(error);
  }
};

export const updatePerson = async (personId: string, updates: Partial<PersonData>) => {
  try {
    await connectToDatabase();

    const updatedPerson = await Person.findByIdAndUpdate(personId, updates, { new: true });

    if (!updatedPerson) {
      throw new Error('Person not found');
    }

    return JSON.parse(JSON.stringify(updatedPerson));
  } catch (error) {
    handleError(error);
  }
};

export const getAllPeople = async () => {
    try {
      await connectToDatabase();
      const people = await Person.find(); // Adjust this query based on your schema and needs
      return JSON.parse(JSON.stringify(people));
    } catch (error) {
      handleError(error);
      throw error; // Ensure to propagate the error for proper error handling
    }
  };

export const deletePerson = async (personId: string) => {
  try {
    await connectToDatabase();

    const deletedPerson = await Person.findByIdAndDelete(personId);

    if (!deletedPerson) {
      throw new Error('Person not found');
    }

    return true; // or return some meaningful success response
  } catch (error) {
    handleError(error);
  }
};
