---
title: Validation Set
slug: Validation Set
date: 2025-06-02 12:03:21
categories: 
  - DL-cards
tags: 深度学习
cover: /image/postcover/valiset.jpeg
comments: false
mathjax: true
copyright: true
---




### 定义

验证集是从原始训练数据中划分出来的一部分数据，它与训练集和测试集不同，主要用于模型训练过程中调整模型的超参数，以及对模型的性能进行初步评估，以避免模型过拟合，提高模型的泛化能力。

### 作用

- **调整超参数**：超参数是在模型训练之前需要手动设置的参数，如学习率、层数、神经元数量、正则化参数等。通过在验证集上评估不同超参数组合下模型的性能，可以找到最优的超参数设置，使模型在测试集或实际应用中表现更好。例如，在训练多层感知机时，通过在验证集上比较不同学习率下模型的损失值和准确率，选择使得验证集准确率最高的学习率作为最终的学习率。
- **防止过拟合**：过拟合是指模型在训练集上表现很好，但在新的数据（测试集或实际应用中的数据）上表现不佳的现象。在训练过程中，使用验证集可以监控模型的性能变化。如果发现模型在训练集上的损失不断下降，而在验证集上的损失开始上升，准确率开始下降，这可能是模型开始过拟合的信号。此时，可以采取一些措施，如提前停止训练、增加正则化项、减少模型复杂度等，以防止模型过拟合。

### 划分方式

- **留出法**：直接将原始数据集按照一定的比例划分为训练集、验证集和测试集。通常情况下，训练集占比 60% - 80%，验证集占比 10% - 20%，测试集占比 10% - 20%。例如，将一个包含 10000 个样本的数据集，按照 7:2:1 的比例划分为 7000 个样本的训练集、2000 个样本的验证集和 1000 个样本的测试集。划分时要确保数据的随机性和代表性，避免数据泄露，即验证集和测试集中的样本不能在训练集中出现过。
- **K 折交叉验证**：将原始数据集划分为 K 个大小相似的子集，每次选择其中一个子集作为验证集，其余 K - 1 个子集作为训练集，进行 K 次训练和验证，最后将 K 次验证的结果进行平均，得到模型的性能评估指标。这种方法可以充分利用数据集，减少因数据划分方式不同而导致的结果偏差。例如，当 K = 5 时，将数据集分成 5 个子集，依次选取每个子集作为验证集，进行 5 次训练和验证。

### 注意点

- **独立同分布**：验证集的数据应与训练集和测试集来自相同的分布，且相互独立。这样才能保证验证集能够准确反映模型在新数据上的性能。如果验证集与训练集、测试集的分布差异较大，那么基于验证集选择的超参数和评估的模型性能可能在实际应用中不具有代表性。
- **不要过度拟合验证集**：虽然验证集用于调整超参数和评估模型，但不能让模型过于适应验证集的数据。否则，模型在验证集上表现良好，但在真正的测试集或新数据上可能表现不佳。例如，为了在验证集上获得更好的性能，不断增加模型的复杂度，直到模型对验证集数据几乎完全拟合，这就导致了对验证集的过拟合。（推荐李宏毅老师的视频）
- **合理使用验证集**：在模型训练过程中，应该根据验证集的反馈及时调整模型的训练策略，但不要过于频繁地根据验证集的结果进行调整，以免引入噪声和不稳定因素。一般可以每隔一定的训练轮数或在训练出现明显变化时，观察验证集的性能指标，进行相应的调整。

  


## 代码示例

以手写数字识别为例，模型采用简单的MLP

### 留出法划分验证集
```python
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, random_split

# 数据预处理
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))
])

# 加载MNIST数据集
train_dataset = datasets.MNIST(root='./data', train=True, download=True, transform=transform)

# 划分训练集和验证集
train_size = int(0.8 * len(train_dataset))
val_size = len(train_dataset) - train_size
train_subset, val_subset = random_split(train_dataset, [train_size, val_size])

# 创建数据加载器
train_loader = DataLoader(train_subset, batch_size=64, shuffle=True)
val_loader = DataLoader(val_subset, batch_size=64, shuffle=False)

# 定义多层感知机模型
class MLP(nn.Module):
    def __init__(self):
        super(MLP, self).__init__()
        self.fc1 = nn.Linear(784, 256)
        self.fc2 = nn.Linear(256, 128)
        self.fc3 = nn.Linear(128, 10)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = x.view(-1, 784)
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        x = self.fc3(x)
        return x

# 创建模型实例
model = MLP()

# 定义损失函数和优化器
criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(model.parameters(), lr=0.001)

# 训练模型并在验证集上评估
num_epochs = 10
for epoch in range(num_epochs):
    model.train()
    running_loss = 0.0
    for data, target in train_loader:
        optimizer.zero_grad()
        output = model(data)
        loss = criterion(output, target)
        loss.backward()
        optimizer.step()
        running_loss += loss.item()

    model.eval()
    val_loss = 0.0
    correct = 0
    total = 0
    with torch.no_grad():
        for data, target in val_loader:
            output = model(data)
            loss = criterion(output, target)
            val_loss += loss.item()
            _, predicted = torch.max(output.data, 1)
            total += target.size(0)
            correct += (predicted == target).sum().item()

    print(f'Epoch {epoch + 1}, Train Loss: {running_loss / len(train_loader)}, '
          f'Val Loss: {val_loss / len(val_loader)}, Val Accuracy: {100 * correct / total}%')
```


### K 折交叉验证
```python
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms
from torch.utils.data import DataLoader, TensorDataset, random_split
from torch.utils.data.dataset import Dataset
from sklearn.model_selection import KFold

# 数据预处理
transform = transforms.Compose([
    transforms.ToTensor(),
    transforms.Normalize((0.1307,), (0.3081,))
])

# 加载MNIST数据集
train_dataset = datasets.MNIST(root='./data', train=True, download=True, transform=transform)

# 定义多层感知机模型
class MLP(nn.Module):
    def __init__(self):
        super(MLP, self).__init__()
        self.fc1 = nn.Linear(784, 256)
        self.fc2 = nn.Linear(256, 128)
        self.fc3 = nn.Linear(128, 10)
        self.relu = nn.ReLU()

    def forward(self, x):
        x = x.view(-1, 784)
        x = self.relu(self.fc1(x))
        x = self.relu(self.fc2(x))
        x = self.fc3(x)
        return x

# 进行K折交叉验证
k = 5
kf = KFold(n_splits=k, shuffle=True, random_state=42)
accuracies = []

for fold, (train_idx, val_idx) in enumerate(kf.split(train_dataset)):
    train_subset = torch.utils.data.Subset(train_dataset, train_idx)
    val_subset = torch.utils.data.Subset(train_dataset, val_idx)

    train_loader = DataLoader(train_subset, batch_size=64, shuffle=True)
    val_loader = DataLoader(val_subset, batch_size=64, shuffle=False)

    model = MLP()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    num_epochs = 5
    for epoch in range(num_epochs):
        model.train()
        running_loss = 0.0
        for data, target in train_loader:
            optimizer.zero_grad()
            output = model(data)
            loss = criterion(output, target)
            loss.backward()
            optimizer.step()
            running_loss += loss.item()

    model.eval()
    correct = 0
    total = 0
    with torch.no_grad():
        for data, target in val_loader:
            output = model(data)
            _, predicted = torch.max(output.data, 1)
            total += target.size(0)
            correct += (predicted == target).sum().item()

    accuracy = 100 * correct / total
    accuracies.append(accuracy)
    print(f'Fold {fold + 1}, Val Accuracy: {accuracy}%')

print(f'Average Accuracy over {k} folds: {sum(accuracies) / k}%')
```


