import sys
import json
from os import walk
import os
import numpy as np
from keras.preprocessing.image import ImageDataGenerator, load_img, img_to_array
from keras.models import Sequential, load_model

cwd = os.getcwd()

# NI = "kF5z1xuCd"
NI = int(sys.argv[1]);
B = int(sys.argv[2]);

L = []
f = []
for (dirpath, dirnames, filenames) in walk("./public/uploads"):
   #  if(filenames[2:-4] == NI):
    f.extend(filenames)
    break
for i in f:
   if(i[3:-4] == NI):
      L.append(i)


img_width, img_height = 150, 150
model_path = './public/model/model.h5'
model_weights_path = '/public/model/weights.h5'
model = load_model(model_path)
model.load_weights(model_weights_path)


D = 0  
M = 0
N = 0

def predict(file):
  global D,M,N
  x = load_img(file, target_size=(img_width,img_height))
  x = img_to_array(x)
  x = np.expand_dims(x, axis=0)
  array = model.predict(x)
  # array = [0.67,0.55,0.27]
  result = array[0]
  answer = np.argmax(result)
  if answer == 0:
    D += 1
  elif answer == 1:
    M += 1
  elif answer == 2:
    N += 1
  return answer 

for i in L:
   result = predict(cwd+i)
   if result == 0:
      diabetes_t += 1
   else:
      diabetes_f += 1


P1 = D/(D+N+M)
P2 = M/(D+N+M)
P3 = N/(D+N+M)


J = {
   "P1": P1,
   "P2": P2,
   "P3": P3,
}
print(json.dumps(J))
sys.stdout.flush()