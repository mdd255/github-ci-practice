import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { HealthController } from './health.controller'

describe('HealthController', () => {
  let controller: HealthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('test'),
          },
        },
      ],
    }).compile()

    controller = module.get<HealthController>(HealthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('checkHealth', () => {
    it('should return health status', () => {
      const result = controller.checkHealth()
      expect(result).toEqual({
        status: 'ok',
        timestamp: expect.any(String),
        environment: 'test',
        version: '1.0.0',
      })
    })
  })

  describe('checkReadiness', () => {
    it('should return readiness status', () => {
      const result = controller.checkReadiness()
      expect(result).toEqual({
        status: 'ready',
        timestamp: expect.any(String),
      })
    })
  })

  describe('checkLiveness', () => {
    it('should return liveness status', () => {
      const result = controller.checkLiveness()
      expect(result).toEqual({
        status: 'alive',
        timestamp: expect.any(String),
      })
    })
  })
})
