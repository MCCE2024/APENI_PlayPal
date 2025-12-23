import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { ConfigService } from '@nestjs/config';

describe('NotificationService', () => {
  let service: NotificationService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const createModule = async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    return module.get<NotificationService>(NotificationService);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', async () => {
    service = await createModule();
    expect(service).toBeDefined();
  });

  it('should NOT initialize Resend in dev mode even if API key is present', async () => {
    mockConfigService.get.mockImplementation((key) => {
      if (key === 'RESEND_API_KEY') return 'test-key';
      if (key === 'NODE_ENV') return 'development';
      return undefined;
    });

    service = await createModule();
    expect(service['resend']).toBeUndefined();
  });

  it('should initialize Resend in production with API key', async () => {
    mockConfigService.get.mockImplementation((key) => {
      if (key === 'RESEND_API_KEY') return 'test-key';
      if (key === 'NODE_ENV') return 'production';
      return undefined;
    });

    service = await createModule();
    expect(service['resend']).toBeDefined();
  });

  it('should initialize Resend in dev mode if ENABLE_REAL_EMAILS is true', async () => {
    mockConfigService.get.mockImplementation((key) => {
      if (key === 'RESEND_API_KEY') return 'test-key';
      if (key === 'NODE_ENV') return 'development';
      if (key === 'ENABLE_REAL_EMAILS') return 'true';
      return undefined;
    });

    service = await createModule();
    expect(service['resend']).toBeDefined();
  });
});
