const express = require('express');
const { query } = require('../connection/db');
const { z } = require('zod');

const router = express.Router();

const CourseSchema = z.object({
  title: z.string().max(100),
  description: z.string().max(200),
  duration: z.number().int(),
  lecturer: z.string().max(100),
  category: z.enum(['Basic', 'Graphics', 'Coding', 'Other']),
  promote: z.boolean().or(z.number().int().min(0).max(1)),
  course_image: z.string().max(20),
});

const CourseCreateSchema = CourseSchema.extend({
  course_id: z.number().int().or(z.string().transform(Number)),
});

const CourseUpdateSchema = CourseSchema.partial().extend({
  course_id: z.number().int().optional().or(z.string().transform(Number)),
});

router.get('/course/list', async (req, res) => {
  try {
    const courses = await query('SELECT * FROM online_course');
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json([]);
  }
});

router.get('/course/search/id', async (req, res) => {
  try {
    const { courseId } = req.query;
    if (!courseId) {
      return res.status(400).json(null);
    }

    const courses = await query(
      'SELECT * FROM online_course WHERE course_id = ?',
      [courseId]
    );

    if (courses.length === 0) {
      res.json(null);
      return;
    }

    res.json(courses[0]);
  } catch (error) {
    console.error('Error searching course:', error);
    res.status(500).json(null);
  }
});

router.get('/course/promote', async (req, res) => {
  try {
    const courses = await query(
      'SELECT * FROM online_course WHERE promote = 1'
    );
    res.json(courses);
  } catch (error) {
    console.error('Error fetching promoted courses:', error);
    res.status(500).json([]);
  }
});

router.post('/course/create', async (req, res) => {
  try {
    const validation = CourseCreateSchema.safeParse(req.body);

    if (!validation.success) {
      console.error(validation.error);
      return res.json({ result: 0, message: 'Validation failed' });
    }

    const {
      course_id,
      title,
      description,
      duration,
      lecturer,
      category,
      promote,
      course_image,
    } = validation.data;
    const promoteValue = promote === true ? 1 : promote === false ? 0 : promote;

    let result;
    result = await query(
      'INSERT INTO online_course (course_id, title, description, duration, lecturer, category, promote, course_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        course_id,
        title,
        description,
        duration,
        lecturer,
        category,
        promoteValue,
        course_image,
      ]
    );

    if (result.affectedRows > 0) {
      res.json({
        result: 1,
        id: result.insertId || course_id,
        message: 'Course created successfully',
      });
    } else {
      res.json({ result: 0, message: 'Failed to create course' });
    }
  } catch (error) {
    console.error('Error creating course:', error);
    res.json({ result: 0, message: 'Error creating course' });
  }
});

router.put('/course/update', async (req, res) => {
  try {
    const validation = CourseUpdateSchema.safeParse(req.body);

    if (!validation.success) {
      console.error(validation.error);
      return res.json({ result: 0, message: 'Validation failed' });
    }

    const updates = validation.data;
    const courseId = updates.course_id || req.body.course_id;

    if (!courseId) {
      return res.json({ result: 0, message: 'Missing course_id' });
    }

    delete updates.course_id;

    if (Object.keys(updates).length === 0) {
      return res.json({ result: 0, message: 'No fields to update' });
    }

    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'promote') {
        fields.push(`${key} = ?`);
        values.push(value === true ? 1 : value === false ? 0 : value);
      } else {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    values.push(courseId);

    const result = await query(
      `UPDATE online_course SET ${fields.join(', ')} WHERE course_id = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.json({ result: 0, message: 'Course not found' });
    }

    if (result.changedRows === 0) {
      return res.json({ result: 0, message: 'No changes made' });
    }

    res.json({ result: 1, message: 'Course updated successfully' });
  } catch (error) {
    console.error('Error updating course:', error);
    res.json({ result: 0, message: 'Error updating course' });
  }
});

router.delete('/course/delete', async (req, res) => {
  try {
    const { courseId } = req.query;

    if (!courseId) {
      return res.json({ result: 0, message: 'Missing courseId' });
    }

    const result = await query(
      'DELETE FROM online_course WHERE course_id = ?',
      [courseId]
    );

    if (result.affectedRows > 0) {
      res.json({ result: 1, message: 'Course deleted successfully' });
    } else {
      res.json({ result: 0, message: 'Course not found' });
    }
  } catch (error) {
    console.error('Error deleting course:', error);
    res.json({ result: 0, message: 'Error deleting course' });
  }
});

module.exports = router;
