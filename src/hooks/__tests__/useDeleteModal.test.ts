import { renderHook, act } from '@testing-library/react';
import { useDeleteModal } from '../useDeleteModal';

describe('useDeleteModal', () => {
  describe('Initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useDeleteModal());

      expect(result.current.isOpen).toBe(false);
      expect(result.current.entityId).toBeNull();
      expect(result.current.entityName).toBeNull();
      expect(typeof result.current.open).toBe('function');
      expect(typeof result.current.close).toBe('function');
      expect(typeof result.current.handleSuccess).toBe('function');
    });

    it('should accept options with callbacks', () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(() => useDeleteModal({ onSuccess }));

      expect(result.current.isOpen).toBe(false);
      expect(result.current.entityId).toBeNull();
      expect(result.current.entityName).toBeNull();
    });
  });

  describe('Opening modal', () => {
    it('should open modal with entity ID only', () => {
      const { result } = renderHook(() => useDeleteModal());

      act(() => {
        result.current.open('123');
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.entityId).toBe('123');
      expect(result.current.entityName).toBeNull();
    });

    it('should open modal with entity ID and name', () => {
      const { result } = renderHook(() => useDeleteModal());

      act(() => {
        result.current.open('456', 'Test Entity');
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.entityId).toBe('456');
      expect(result.current.entityName).toBe('Test Entity');
    });

    it('should handle empty string as entity name', () => {
      const { result } = renderHook(() => useDeleteModal());

      act(() => {
        result.current.open('789', '');
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.entityId).toBe('789');
      expect(result.current.entityName).toBeNull();
    });

    it('should override previous values when opened multiple times', () => {
      const { result } = renderHook(() => useDeleteModal());

      // First open
      act(() => {
        result.current.open('111', 'First Entity');
      });

      expect(result.current.entityId).toBe('111');
      expect(result.current.entityName).toBe('First Entity');

      // Second open - should override
      act(() => {
        result.current.open('222', 'Second Entity');
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.entityId).toBe('222');
      expect(result.current.entityName).toBe('Second Entity');
    });
  });

  describe('Closing modal', () => {
    it('should close modal and reset state', () => {
      const { result } = renderHook(() => useDeleteModal());

      // First open modal
      act(() => {
        result.current.open('123', 'Test Entity');
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.entityId).toBe('123');
      expect(result.current.entityName).toBe('Test Entity');

      // Then close it
      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.entityId).toBeNull();
      expect(result.current.entityName).toBeNull();
    });

    it('should handle closing when already closed', () => {
      const { result } = renderHook(() => useDeleteModal());

      // Close without opening first
      act(() => {
        result.current.close();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.entityId).toBeNull();
      expect(result.current.entityName).toBeNull();
    });
  });

  describe('Success handling', () => {
    it('should call onSuccess callback and close modal', () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(() => useDeleteModal({ onSuccess }));

      // Open modal first
      act(() => {
        result.current.open('123', 'Test Entity');
      });

      expect(result.current.isOpen).toBe(true);

      // Handle success
      act(() => {
        result.current.handleSuccess();
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(result.current.isOpen).toBe(false);
      expect(result.current.entityId).toBeNull();
      expect(result.current.entityName).toBeNull();
    });

    it('should close modal even without onSuccess callback', () => {
      const { result } = renderHook(() => useDeleteModal());

      // Open modal
      act(() => {
        result.current.open('456', 'Another Entity');
      });

      expect(result.current.isOpen).toBe(true);

      // Handle success without callback
      act(() => {
        result.current.handleSuccess();
      });

      expect(result.current.isOpen).toBe(false);
      expect(result.current.entityId).toBeNull();
      expect(result.current.entityName).toBeNull();
    });

    it('should handle success when modal is already closed', () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(() => useDeleteModal({ onSuccess }));

      // Handle success without opening modal
      act(() => {
        result.current.handleSuccess();
      });

      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('Edge cases', () => {
    it('should handle undefined entity name', () => {
      const { result } = renderHook(() => useDeleteModal());

      act(() => {
        result.current.open('123', undefined as any);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.entityId).toBe('123');
      expect(result.current.entityName).toBeNull();
    });

    it('should handle null entity name explicitly', () => {
      const { result } = renderHook(() => useDeleteModal());

      act(() => {
        result.current.open('123', null as any);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.entityId).toBe('123');
      expect(result.current.entityName).toBeNull();
    });

    it('should handle special characters in entity ID and name', () => {
      const { result } = renderHook(() => useDeleteModal());

      const specialId = 'entity-123_456#test';
      const specialName = 'Entity with "quotes" and émojis! 🚀';

      act(() => {
        result.current.open(specialId, specialName);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.entityId).toBe(specialId);
      expect(result.current.entityName).toBe(specialName);
    });

    it('should handle very long entity names', () => {
      const { result } = renderHook(() => useDeleteModal());

      const longName = 'A'.repeat(1000); // Very long name

      act(() => {
        result.current.open('123', longName);
      });

      expect(result.current.isOpen).toBe(true);
      expect(result.current.entityId).toBe('123');
      expect(result.current.entityName).toBe(longName);
    });
  });

  describe('Multiple operations sequence', () => {
    it('should handle open -> close -> open sequence', () => {
      const { result } = renderHook(() => useDeleteModal());

      // First cycle
      act(() => {
        result.current.open('111', 'First');
      });
      expect(result.current.isOpen).toBe(true);

      act(() => {
        result.current.close();
      });
      expect(result.current.isOpen).toBe(false);

      // Second cycle
      act(() => {
        result.current.open('222', 'Second');
      });
      expect(result.current.isOpen).toBe(true);
      expect(result.current.entityId).toBe('222');
      expect(result.current.entityName).toBe('Second');
    });

    it('should handle open -> success -> open sequence', () => {
      const onSuccess = jest.fn();
      const { result } = renderHook(() => useDeleteModal({ onSuccess }));

      // First cycle
      act(() => {
        result.current.open('111', 'First');
      });

      act(() => {
        result.current.handleSuccess();
      });
      expect(onSuccess).toHaveBeenCalledTimes(1);
      expect(result.current.isOpen).toBe(false);

      // Second cycle
      act(() => {
        result.current.open('333', 'Third');
      });

      act(() => {
        result.current.handleSuccess();
      });
      expect(onSuccess).toHaveBeenCalledTimes(2);
      expect(result.current.isOpen).toBe(false);
    });
  });

  describe('Callback behavior', () => {
    it('should work with different callback types', () => {
      let callbackExecuted = false;
      const onSuccess = () => {
        callbackExecuted = true;
      };

      const { result } = renderHook(() => useDeleteModal({ onSuccess }));

      act(() => {
        result.current.handleSuccess();
      });

      expect(callbackExecuted).toBe(true);
    });

    it('should handle async callbacks', () => {
      const asyncCallback = jest.fn().mockResolvedValue('success');
      const { result } = renderHook(() => useDeleteModal({ onSuccess: asyncCallback }));

      act(() => {
        result.current.handleSuccess();
      });

      expect(asyncCallback).toHaveBeenCalledTimes(1);
    });

    it('should allow callback to throw error (error handling is up to caller)', () => {
      const throwingCallback = jest.fn(() => {
        throw new Error('Callback error');
      });

      const { result } = renderHook(() => useDeleteModal({ onSuccess: throwingCallback }));

      expect(() => {
        act(() => {
          result.current.handleSuccess();
        });
      }).toThrow('Callback error');

      expect(throwingCallback).toHaveBeenCalledTimes(1);
      // Modal should still close even if callback throws
      expect(result.current.isOpen).toBe(false);
    });
  });
});