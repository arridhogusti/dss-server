const jsonServer = require('json-server');
const fs = require('fs')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middlewares = jsonServer.defaults();
const _ = require('lodash')
const {v4: uuidv4} = require('uuid')
const port = process.env.PORT || 4000;


const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

server.use(middlewares);
server.use(jsonServer.bodyParser)

const SECRET_KEY = '123456789'
const expiresIn = '365d'


// Create a token from a payload
function createToken(payload) {
    return jwt.sign(payload, SECRET_KEY, {expiresIn})
}

// Verify the token
function verifyToken(token) {
    return jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)
}

// Check if the user exists in database
function isAuthenticated({email, password}) {
    return userdb.users.findIndex(user => user.email === email && user.password === password) !== -1
}

server.post('/auth/login', (req, res) => {
    const {email, password} = req.body
    if (isAuthenticated({email, password}) === false) {
        const status = 401
        const message = 'Incorrect email or password'
        res.status(status).json({status, message})
        return
    }
    const user = userdb.users.find(user => user.email === email && user.password === password)
    const access_token = createToken(user)
    res.status(200).json({access_token})
})

// server.use(/^(?!\/auth).*$/, (req, res, next) => {
//   if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
//     const status = 401
//     const message = 'Bad authorization header'
//     res.status(status).json({ status, message })
//     return
//   }
//   try {
//     verifyToken(req.headers.authorization.split(' ')[1])
//     next()
//   } catch (err) {
//     const status = 401
//     const message = 'Error: access_token is not valid'
//     res.status(status).json({ status, message })
//   }
// })

server.get('/verifyToken', (req, res) => {
    res.jsonp({
        data: verifyToken(req.query.authorization)
    })
})

server.get('/communication', (req, res) => {
    const {authorId} = req.query
    const db = router.db; // Assign the lowdb instance
    const employeeTable = db.get('employee');
    const communicationTable = db.get('communication');
    var mergedEmployeeCommunication = _.map(employeeTable.valueOf().filter(i => i.id !== authorId), function (item) {
        const questionnaire = _.find(communicationTable.valueOf(), {'employeeId': item.id, 'authorId': authorId})
        return {
            ...item,
            questionnaire: questionnaire || null
        }
    });
    res.jsonp([
        ...mergedEmployeeCommunication
    ])
})
server.get('/initiative', (req, res) => {
    const {authorId} = req.query
    const db = router.db; // Assign the lowdb instance
    const employeeTable = db.get('employee');
    const initiativeTable = db.get('initiative');
    var mergedEmployeeInitiative = _.map(employeeTable.valueOf().filter(i => i.id !== authorId), function (item) {
        const questionnaire = _.find(initiativeTable.valueOf(), {'employeeId': item.id, 'authorId': authorId})
        return {
            ...item,
            questionnaire: questionnaire || null
        }
    });
    res.jsonp([
        ...mergedEmployeeInitiative
    ])
})
server.get('/attitude', (req, res) => {
    const {authorId} = req.query
    const db = router.db; // Assign the lowdb instance
    const employeeTable = db.get('employee');
    const attitudeTable = db.get('attitude');
    var mergedEmployeeAttitude = _.map(employeeTable.valueOf().filter(i => i.id !== authorId), function (item) {
        const questionnaire = _.find(attitudeTable.valueOf(), {'employeeId': item.id, 'authorId': authorId})
        return {
            ...item,
            questionnaire: questionnaire || null
        }
    });
    res.jsonp([
        ...mergedEmployeeAttitude
    ])
})

server.post('/save-communication', (req, res) => {
    const db = router.db; // Assign the lowdb instance
    if (Array.isArray(req.body)) {
        req.body.forEach(element => {
            insert(db, 'communication', element);
        });
    } else {
        insert(db, 'communication', req.body);
    }
    res.sendStatus(200)

    function insert(db, collection, data) {
        const table = db.get(collection);

        // Create a new doc if this ID does not exist
        if (_.isEmpty(table.find({id: data.id}).value())) {
            data.id = uuidv4()
            table.push(data).write();
        } else {
            // Update the existing data
            table.find({id: data.id})
                .assign(_.omit(data, ['id']))
                .write();
        }
    }
});

server.post('/save-initiative', (req, res) => {
    const db = router.db; // Assign the lowdb instance
    if (Array.isArray(req.body)) {
        req.body.forEach(element => {
            insert(db, 'initiative', element);
        });
    } else {
        insert(db, 'initiative', req.body);
    }
    res.sendStatus(200)

    function insert(db, collection, data) {
        const table = db.get(collection);

        // Create a new doc if this ID does not exist
        if (_.isEmpty(table.find({id: data.id}).value())) {
            data.id = uuidv4()
            table.push(data).write();
        } else {
            // Update the existing data
            table.find({id: data.id})
                .assign(_.omit(data, ['id']))
                .write();
        }
    }
});

server.post('/save-attitude', (req, res) => {
    const db = router.db; // Assign the lowdb instance
    if (Array.isArray(req.body)) {
        req.body.forEach(element => {
            insert(db, 'attitude', element);
        });
    } else {
        insert(db, 'attitude', req.body);
    }
    res.sendStatus(200)

    function insert(db, collection, data) {
        const table = db.get(collection);

        // Create a new doc if this ID does not exist
        if (_.isEmpty(table.find({id: data.id}).value())) {
            data.id = uuidv4()
            table.push(data).write();
        } else {
            // Update the existing data
            table.find({id: data.id})
                .assign(_.omit(data, ['id']))
                .write();
        }
    }
});

const nilai = [
    {
        employeeId: 'Khirzan',
        c1: 5,
        c2: 60,
        c3: 70,
        c4: 90,
        c5: 85,
        c6: 90,
    },
    {
        employeeId: 'Widodo',
        c1: 5,
        c2: 80,
        c3: 90,
        c4: 80,
        c5: 90,
        c6: 90,
    },
    {
        employeeId: 'Yudi',
        c1: 4,
        c2: 60,
        c3: 85,
        c4: 65,
        c5: 80,
        c6: 80,
    },
    {
        employeeId: 'Edi',
        c1: 4,
        c2: 60,
        c3: 85,
        c4: 80,
        c5: 85,
        c6: 85,
    },
    {
        employeeId: 'Ega',
        c1: 3,
        c2: 60,
        c3: 80,
        c4: 75,
        c5: 70,
        c6: 80,
    },
]

const getWorkingAge = (date) => {
    let total = 0
    const today = new Date()
    const tempWorkingAge = new Date(date)
    const diff = Math.floor(today.getTime() - tempWorkingAge.getTime())
    const day = 1000 * 60 * 60 * 24

    const days = Math.floor(diff / day)
    const months = Math.floor(days / 31)
    const years = Math.floor(months / 12)

    if (years > 0 && years <= 2) total = 20
    else if (years > 2 && years <= 3) total = 40
    else if (years > 3 && years <= 4) total = 60
    else if (years > 4 && years <= 5) total = 80
    else if (years > 5) total = 100

    return total
}

const getScoreQuestionnaire = (data, dataEmployee, employeeId) => {
    const tempScore = data
        .filter(c => c.employeeId === employeeId)
        .reduce((a, b) => a + b.value, 0)

    const scoreMax = (dataEmployee.length - 1) * 5

    return tempScore / scoreMax * 100
}

const getDifferentDate = (endDate, startDate) => {
    return Math.floor((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24) + 1)
}
const getPercentageAttendance = (attendances, item) => {
    const getTotalLeave = attendances.filter(a => a.authorId === item.id).map(a => {
        a.totalDate = getDifferentDate(a.endDate, a.startDate)
        return a
    }).reduce((a, b) => a + b.totalDate, 0).valueOf()
    const getTotalDay = getDifferentDate(new Date(), item.joinDate)
    return Math.floor(100 - ((getTotalLeave / getTotalDay) * 100))
}

const getPercentageTask = (todo, item) => {
    const getSuccessTodo = todo.filter(t => t.authorId === item.id).valueOf().reduce((a, b) => a + b.status, 0)
    if (!getSuccessTodo) return 0
    return Math.round(getSuccessTodo / todo.filter(t => t.authorId === item.id).valueOf().length * 100)
}

server.get('/appraisal', (req, res) => {
    const db = router.db;
    const criteria = db.get('criteria')
    const employee = db.get('employee')
    const communication = db.get('communication')
    const initiative = db.get('initiative')
    const attitude = db.get('attitude')
    const attendance = db.get('attendance')
    const todo = db.get('todo')

    let score = []

    employee.valueOf().filter(item => item.id !== '4d0b2668-8754-4920-8e66-a50a5dc5c44c').map((item, idx) => {

        const tempWorkingAge = getWorkingAge(item.joinDate)

        score[idx] = {
            employeeId: item.id,
            name: item.name,
            c1: getPercentageTask(todo, item),
            c2: getScoreQuestionnaire(communication.valueOf(), employee.valueOf(), item.id),
            c3: getScoreQuestionnaire(initiative.valueOf(), employee.valueOf(), item.id),
            c4: getPercentageAttendance(attendance, item),
            c5: tempWorkingAge,
            c6: getScoreQuestionnaire(attitude.valueOf(), employee.valueOf(), item.id),
        }
    })
    const normalization = score.map(item => ({...item}))

    criteria.valueOf().map(item => {
        let min = 0;
        let max = 0;
        if (item.atribut === 'cost') {
            min = Math.min.apply(Math, score.map(function (o) {
                return o[item.code];
            }))

            normalization.map((itemNormalisasi, idx) => {
                itemNormalisasi[item.code] = min / score[idx][item.code]
            })
        } else if (item.atribut === 'benefit') {
            max = Math.max.apply(Math, score.map(function (o) {
                return o[item.code];
            }))
            normalization.map((itemNormalisasi, idx) => {
                itemNormalisasi[item.code] = score[idx][item.code] / max
            })
        }
    })
    const rangkingStage = normalization.map(item => ({...item}));
    rangkingStage.map((item, idx) => {
        item.total = criteria.valueOf().map(c => item[c.code] * c.bobot).reduce((a, b) => a + b)
    })
    rangkingStage.map(item => {
        const tempRangkingStage = rangkingStage.map(item => ({...item}));
        item.rank = tempRangkingStage.sort((a, b) => b.total - a.total).map(item => item.total).indexOf(item.total) + 1
    })
    res.jsonp(
        {
            score,
            normalization,
            rangkingStage,
            criteria
        }
    )

})

server.use(router);

server.listen(port);
