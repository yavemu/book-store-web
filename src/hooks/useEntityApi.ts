import { useApiCall } from './useApiCall';

interface EntityApi<CreateT, UpdateT, EntityT> {
  create: (data: CreateT) => Promise<EntityT>;
  update: (id: string, data: UpdateT) => Promise<EntityT>;
  delete?: (id: string) => Promise<{ message: string }>;
  getById?: (id: string) => Promise<EntityT>;
}

interface UseEntityApiOptions {
  onCreateSuccess?: () => void;
  onUpdateSuccess?: () => void;
  onDeleteSuccess?: () => void;
  entityName?: string;
}

export function useEntityApi<CreateT, UpdateT, EntityT>(
  api: EntityApi<CreateT, UpdateT, EntityT>,
  options: UseEntityApiOptions = {}
) {
  const { entityName = 'elemento' } = options;

  const createCall = useApiCall<EntityT>({
    onSuccess: options.onCreateSuccess,
  });

  const updateCall = useApiCall<EntityT>({
    onSuccess: options.onUpdateSuccess,
  });

  const deleteCall = useApiCall<{ message: string }>({
    onSuccess: options.onDeleteSuccess,
  });

  const create = async (data: CreateT) => {
    return await createCall.execute(() => api.create(data));
  };

  const update = async (id: string, data: UpdateT) => {
    return await updateCall.execute(() => api.update(id, data));
  };

  const remove = async (id: string) => {
    if (!api.delete) {
      throw new Error(`Delete operation not supported for ${entityName}`);
    }
    
    return await deleteCall.execute(() => api.delete!(id));
  };

  return {
    create,
    update,
    delete: remove,
    states: {
      create: createCall.state,
      update: updateCall.state,
      delete: deleteCall.state,
    },
    reset: {
      create: createCall.reset,
      update: updateCall.reset,
      delete: deleteCall.reset,
    }
  };
}