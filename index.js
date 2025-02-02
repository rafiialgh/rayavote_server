const express = require('express');
const cors = require('cors')
const connectDB = require('./db');
var path = require('path');
// const authRoutes = require('./routes/auth');
const authRouter = require('./app/auth/router');
// const electionRoutes = require('./routes/election');
const voterRouter = require('./app/voter/router');
const companyRouter = require('./app/company/router');
const electionRouter = require('./app/election/router')
const candidateRouter = require('./app/candidates/router')
const dashboardRouter = require('./app/dashboard/router')
const resultRouter = require('./app/result/router')

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));


connectDB();

//Routes
app.use('/api/auth', authRouter);
// app.use('/api/election', electionRoutes);
app.use('/api/voter', voterRouter);
app.use('/api/company', companyRouter);
app.use('/api/election', electionRouter);
app.use('/api/candidate', candidateRouter);
app.use('/api/dashboard', dashboardRouter)
app.use('/api/result', resultRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));

module.exports = app;