const request = require('supertest');
const app = require('./<path-to-your-main-file>');  // Update the path to point to your main file

describe('SMS service endpoints', () => {
  it('should handle incoming SMS with generic messages', async () => {
    const res = await request(app)
      .post('/sms')
      .send({ Body: 'Hello', From: '+1234567890' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Message sent!');
  });

  it('should sign up user with "morning" keyword', async () => {
    const res = await request(app)
      .post('/sms')
      .send({ Body: 'morning', From: '+1234567891' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Message sent!');
  });

  it('should unsubscribe user with "pause" keyword', async () => {
    const res = await request(app)
      .post('/sms')
      .send({ Body: 'pause', From: '+1234567892' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Message sent!');
  });

  it('should handle users who are already signed up', async () => {
    // Simulate a user who is already in the system
    // Mock or setup the database query to return true for `isUser`
    
    const res = await request(app)
      .post('/sms')
      .send({ Body: 'morning', From: '+1234567891' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Message sent!');
    expect(res.body).toContain('already signed up');
  });

  it('should send options to users for non-morning and non-pause messages', async () => {
    const res = await request(app)
      .post('/sms')
      .send({ Body: 'Hi there!', From: '+1234567893' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe('Message sent!');
    expect(res.body).toContain('Good Morning GPT');
  });

  // it('should handle error scenarios gracefully', async () => {
  //   // Mock the Twilio client or OpenAI API to throw an error for testing purpose
  //   // jest.mock('twilio', () => { throw new Error('Fake Twilio Error') });
    
  //   const res = await request(app)
  //     .post('/sms')
  //     .send({ Body: 'Hi again!', From: '+1234567894' });
    
  //   expect(res.statusCode).toEqual(500);
  //   expect(res.text).toBe('Error sending message');
  // });

});