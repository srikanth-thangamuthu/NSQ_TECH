const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;
const JWT_SECRET = 'nsqtech-secret-key';
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
}

const loginUsers = [
  {
    userId: 'admin',
    password: 'admin123',
    role: 'Admin'
  },
  {
    userId: 'user',
    password: 'user123',
    role: 'General User'
  }
];

let users = [
  {
    id: 1,
    name: 'Sri Kanth',
    email: 'srikanth@test.com',
    role: 'Admin',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Rahul',
    email: 'rahul@test.com',
    role: 'General User',
    status: 'Active'
  }
];

app.post('/login', (req, res) => {
  const { userId, password, role } = req.body;

  const foundUser = loginUsers.find(
    user =>
      user.userId === userId &&
      user.password === password &&
      user.role === role
  );

  setTimeout(() => {
    if (!foundUser) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    res.json({
      success: true,
      token: jwt.sign(
  {
    userId: foundUser.userId,
    role: foundUser.role
  },
  JWT_SECRET,
  {
    expiresIn: '1h'
  }
),
      user: {
        userId: foundUser.userId,
        role: foundUser.role
      }
    });
  }, 300);
});

app.get('/records',verifyToken, (req, res) => {
  res.json([
    {
      candidate: 'Arun Kumar',
      company: 'TCS',
      status: 'Verified',
      accessLevel: 'General User'
    },
    {
      candidate: 'Priya Sharma',
      company: 'Infosys',
      status: 'Pending',
      accessLevel: 'General User'
    },
    {
      candidate: 'Karthik Raj',
      company: 'Wipro',
      status: 'Rejected',
      accessLevel: 'Admin'
    }
  ]);
});

app.get('/users',verifyToken, (req, res) => {
  res.json(users);
});

app.post('/users', verifyToken, (req, res) => {
  const newUser = {
    id: Date.now(),
    ...req.body,
    status: 'Active'
  };

  users.push(newUser);
  res.json(newUser);
});

app.delete('/users/:id', verifyToken, (req, res) => {
  const id = Number(req.params.id);
  users = users.filter(user => user.id !== id);

  res.json({
    success: true
  });
});
app.put('/users/:id', verifyToken, (req, res) => {
  const id = Number(req.params.id);

  users = users.map(user => {
    if (user.id === id) {
      return {
        ...user,
        ...req.body
      };
    }

    return user;
  });

  const updatedUser = users.find(user => user.id === id);

  res.json(updatedUser);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});