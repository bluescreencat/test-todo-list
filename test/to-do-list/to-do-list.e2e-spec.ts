import { Test } from '@nestjs/testing';
import { ToDoListModule } from '../../src/to-do-list/to-do-list.module';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

describe('ToDoListController [e2e]', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [ToDoListModule ],
        }).compile()

        app = moduleRef.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({ transform: true }));
        await app.init();
        app.close
    })

    const createToDoList = async () => {
        return await request(app.getHttpServer())
                .post('/to-do-list')
                .set('Content-Type', 'application/json')
                .send({ name: "To-do List 1" })
    }

    
    const addActivity = async (toDoListId: number | string) => {
        return await request(app.getHttpServer())
                .post(`/to-do-list/${toDoListId}/activities`)
                .set('Content-Type', 'application/json')
                .send({ detail: 'Activity detail' })
    }

    describe('POST /to-do-list (createToDoList)', () => {
        it('when send invalid input format should response status code 400', async () => {
            return request(app.getHttpServer())
                .post('/to-do-list')
                .set('Content-Type', 'application/json')
                .send()
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
                })
        })

        it('when creating a new to-do list, the to-do list ID should be increasing', async () => {
            let response = await request(app.getHttpServer())
                .post('/to-do-list')
                .set('Content-Type', 'application/json')
                .send({ name: "To-do List 1" })
                expect(response.text).toEqual('1');

                response = await request(app.getHttpServer())
                .post('/to-do-list')
                .set('Content-Type', 'application/json')
                .send({ name: "To-do List 2" })
                expect(response.text).toEqual('2');
        })
    })

    describe('POST /to-do-list/:toDoListId/activities (addActivity)', () => {
        it('when send invalid input format should response status code 400', async () => {
            return request(app.getHttpServer())
                .post('/to-do-list/1/activities')
                .set('Content-Type', 'application/json')
                .send()
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST);
                })
        })

        it('when create a new activity but the to-do list is not exist, should response status code 404', async () => {
            return request(app.getHttpServer())
                .post('/to-do-list/1/activities')
                .set('Content-Type', 'application/json')
                .send({ detail: 'Activity detail' })
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
                })
        })

        it('when creating a new activity is successfully, should response status code 201', async () => {
            let response = await createToDoList();

            const toDoListId = response.text;
            console.debug('toDoListId: ', toDoListId)
            return request(app.getHttpServer())
                .post(`/to-do-list/${toDoListId}/activities`)
                .set('Content-Type', 'application/json')
                .send({ detail: 'Activity detail' })
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.CREATED);
                })
        })
    })


    describe('GET /to-do-list (getAllToDoList)', ()=> {
        it(`when the to-do list is doesn't exist, should response the empty array`, async () => {
            return request(app.getHttpServer())
                .get(`/to-do-list`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.body).toEqual([]);
                })
        })

        it('when the to-do list is already exist, should response the array of to-do list', async () => {
            await createToDoList();

            return request(app.getHttpServer())
                .get(`/to-do-list`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.body).not.toEqual([]);
                    expect(response.statusCode).toEqual(HttpStatus.OK);
                })
        })
    })

    describe('GET /to-do-list/:toDoListId (getToDoList)', ()=> {
        it(`when the to-do list is doesn't exist, should response status code 404`, async () => {
            return request(app.getHttpServer())
                .get(`/to-do-list/1`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
                })
        })

        it('when the to-do list is already exist, should response a to-do list', async () => {
            let response = await createToDoList();
            const toDoListId = response.text;
            return request(app.getHttpServer())
                .get(`/to-do-list/${toDoListId}`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.body).not.toBeNull();
                    expect(response.statusCode).toEqual(HttpStatus.OK);
                })
        })
    })

    describe('GET /to-do-list/:toDoListId/activities (getActivities)', ()=> {
        it(`when the to-do list is doesn't exist, should response status code 404`, async () => {
            return request(app.getHttpServer())
                .get(`/to-do-list/1/activities`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
                })
        })

        it(`when the to-do list is already exist but the activitiy is doesn't exist, should response the empty array of activity`, async () => {
            let response = await createToDoList();

            return request(app.getHttpServer())
                .get(`/to-do-list/${response.text}/activities`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.body).toEqual([]);
                    expect(response.statusCode).toEqual(HttpStatus.OK);
                })
        })

        it(`when the to-do list is already exist and have an activitiy, should response the array with activity`, async () => {
            let response = await createToDoList();
            const toDoListId = response.text;
            await addActivity(toDoListId);

            return request(app.getHttpServer())
                .get(`/to-do-list/${response.text}/activities`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.body).not.toEqual([]);
                    expect(response.statusCode).toEqual(HttpStatus.OK);
                })
        })
    })

    describe('GET /to-do-list/:toDoListId/activities/:activityId (getActivity)', ()=> {
        it(`when the to-do list is doesn't exist, should response status code 404`, async () => {
            return request(app.getHttpServer())
                .get(`/to-do-list/1/activities/1`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
                })
        })

        it(`when the to-do list is already exist but the activitiy is doesn't exist, should response status code 404`, async () => {
            let response = await createToDoList();

            return request(app.getHttpServer())
                .get(`/to-do-list/${response.text}/activities/1`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND);
                })
        })

        it(`when the to-do list is already exist and have an activitiy, should response the an activity`, async () => {
            let response = await createToDoList();
            const toDoListId = response.text;
            let activityResponse = await addActivity(toDoListId);

            return request(app.getHttpServer())
                .get(`/to-do-list/${response.text}/activities/${activityResponse.text}`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.body).not.toBeNull();
                    expect(response.statusCode).toEqual(HttpStatus.OK);
                })
        })
    })

    describe('PUT /to-do-list/:toDoListId (updateToDoList)', ()=> {
        const newName = 'New To-Do List name';
        it(`when the input is invalid format, should response status code 400`, async () => {
            return request(app.getHttpServer())
                .put(`/to-do-list/1`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.BAD_REQUEST)
                })
        })

        it(`when the to-do list is doesn't exist, should response status code 404`, async () => {
            return request(app.getHttpServer())
                .put(`/to-do-list/1`)
                .set('Content-Type', 'application/json')
                .send({ name: newName })
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
                })
        })

        it('when the to-do list is created and updated, should response status code 200 and the data should be changed', async () => {
            let response = await createToDoList();
            const toDoListId = response.text;
            
            await request(app.getHttpServer())
                .put(`/to-do-list/${toDoListId}`)
                .set('Content-Type', 'application/json')
                .send({ name: newName })
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.OK);
                })
            
            const toDoList = await request(app.getHttpServer())
                .get(`/to-do-list/${toDoListId}`)
                .set('Content-Type', 'application/json')
            expect(toDoList?.body?.name).toEqual(newName);
        })
    })

    describe('PUT /to-do-list/:toDoListId/activities (updateActivity)', ()=> {
        const newIsActive = true;
        const newDetail = 'New Detail';

        it(`when the to-do list is doesn't exist, should response status code 404`, async () => {
            return request(app.getHttpServer())
                .put(`/to-do-list/1/activities`)
                .set('Content-Type', 'application/json')
                .send({ isActive: newIsActive, detail: newDetail })
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
                })
        })

        it(`when the to-do list is already exist but doesn't have an activity, should response status code 404`, async () => {
            const response = await createToDoList();
            const toDoListId = response.text;
            return request(app.getHttpServer())
                .put(`/to-do-list/${toDoListId}/activities/1`)
                .set('Content-Type', 'application/json')
                .send({ isActive: newIsActive, detail: newDetail })
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
                })
        })

        it('when the to-do list is created and updated, should response status code 200 and the data should be changed', async () => {
            let response = await createToDoList();
            const toDoListId = response.text;
            let activityResponse = await addActivity(toDoListId);
            const activityId = activityResponse.text;
            await request(app.getHttpServer())
                .put(`/to-do-list/${toDoListId}/activities/${activityId}`)
                .set('Content-Type', 'application/json')
                .send({ isActive: newIsActive, detail: newDetail })
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.OK);
                })
            
            const toDoList = await request(app.getHttpServer())
                .get(`/to-do-list/${toDoListId}/activities/${activityId}`)
                .set('Content-Type', 'application/json')
            expect(toDoList?.body?.isActive).toEqual(newIsActive);
            expect(toDoList?.body?.detail).toEqual(newDetail);
        })
    })

    describe('DELETE /to-do-list/:toDoListId (deleteToDoList)', ()=> {

        it(`when the to-do list is doesn't exist, should response status code 404`, async () => {
            return request(app.getHttpServer())
                .delete(`/to-do-list/1`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
                })
        })

        it('when the to-do list is created and updated, should response status code 204 and the data should be changed', async () => {
            let response = await createToDoList();
            const toDoListId = response.text;
            await request(app.getHttpServer())
                .delete(`/to-do-list/${toDoListId}`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NO_CONTENT);
                })
        })
    })

    describe('DELETE /to-do-list/:toDoListId/activities/:activityId (deleteActivity)', ()=> {
        const newIsActive = true;
        const newDetail = 'New Detail';

        it(`when the to-do list is doesn't exist, should response status code 404`, async () => {
            return request(app.getHttpServer())
                .delete(`/to-do-list/1/activities`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
                })
        })

        it(`when the to-do list is already exist but doesn't have an activity, should response status code 404`, async () => {
            const response = await createToDoList();
            const toDoListId = response.text;
            return request(app.getHttpServer())
                .put(`/to-do-list/${toDoListId}/activities/1`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NOT_FOUND)
                })
        })

        it('when the to-do list is created and updated, should response status code 204 and the data should be changed', async () => {
            let response = await createToDoList();
            const toDoListId = response.text;
            let activityResponse = await addActivity(toDoListId);
            const activityId = activityResponse.text;
            await request(app.getHttpServer())
                .delete(`/to-do-list/${toDoListId}/activities/${activityId}`)
                .set('Content-Type', 'application/json')
                .then((response) => {
                    expect(response.statusCode).toEqual(HttpStatus.NO_CONTENT);
                })
        })
    })

    afterEach(async () => {
        await app.close();
    })
})