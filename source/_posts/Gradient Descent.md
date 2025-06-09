---
title: Gradient Descent
slug: Gradient Descent
categories: 
  - DL-cards
tags: 深度学习
cover: /image/postcover/gradient.jpg
---

> 梯度下降（Gradient Descent）是机器学习和深度学习中广泛使用的一种优化算法，可以类比于单变量函数中的牛顿法（切线近似）

### 基本概念 

在数学中，梯度是一个向量，它的方向指向函数增长最快的方向，而其反方向则是函数下降最快的方向。梯度下降算法的核心思想就是沿着目标函数的梯度反方向，逐步更新模型的参数，以达到最小化目标函数的目的。 

想象你在一座大山上，目标是找到山的最低点（即目标函数的最小值）。梯度下降就像是你每次都朝着最陡峭向下（即梯度反方向）的路径走一步，通过不断地重复这个过程，逐渐接近山底。


### 数学原理 

假设我们有一个目标函数 $J(\theta)$，其中 $\theta$ 是模型的参数向量（例如在线性回归中，$\theta$ 包含了权重和偏置）。梯度下降的参数更新公式为： $$\theta_{i} = \theta_{i} - \alpha \frac{\partial J(\theta)}{\partial \theta_{i}} $$ 其中，$\theta_{i}$ 是参数向量 $\theta$ 的第 $i$ 个分量，$\frac{\partial J(\theta)}{\partial \theta_{i}}$ 是目标函数 $J(\theta)$ 关于 $\theta_{i}$ 的偏导数，也就是梯度的第 $i$ 个分量。

$\alpha$ 是学习率（Learning Rate），它控制着每次参数更新的步长大小。 学习率是一个非常重要的超参数： 
- 如果 $\alpha$ 太小，参数更新的速度会很慢，需要很多次迭代才能收敛到最小值附近。 
- 如果 $\alpha$ 太大，可能会导致参数更新时跳过最小值，甚至使算法无法收敛出现发散的情况。 


### 类型(及变体)

*（变体还是要单独讲才行）*


#### 批量梯度下降（Batch Gradient Descent，BGD） 
在批量梯度下降中，每次更新参数时都使用整个训练数据集来计算梯度。即计算目标函数 $J(\theta)$ 对所有训练样本的梯度，然后进行参数更新。 优点：由于使用了全部数据，梯度的计算比较准确，最终能够收敛到全局最优解（如果目标函数是凸函数）或局部最优解（对于非凸函数）。 缺点：当训练数据集很大时，每次计算梯度的计算量非常大，计算效率低，而且可能无法一次性将所有数据加载到内存中。

#### 随机梯度下降（Stochastic Gradient Descent，SGD） 
随机梯度下降每次只使用一个训练样本（而不是整个数据集）来计算梯度并更新参数。 优点：计算速度快，每次只处理一个样本，内存需求小，并且在一定程度上可以避免陷入局部最优解（因为每次更新的方向是随机的）。 缺点：由于每次只使用一个样本，梯度的估计可能不准确，导致更新过程中存在较大的波动，收敛过程可能会比较曲折，而且很难收敛到精确的最优解，通常只能收敛到最优解附近。 （仔细思考就会觉得SGD有些有趣，多次混乱的结果走向了稳定的最优解）

#### 小批量梯度下降（Mini-Batch Gradient Descent） 
小批量梯度下降是批量梯度下降和随机梯度下降的折中方案。它每次使用一小部分训练样本（称为一个小批量，如 16、32、64 等）来计算梯度并更新参数。 优点：综合了批量梯度下降和随机梯度下降的优点，既可以减少梯度估计的方差（相对于 SGD），又能提高计算效率（相对于 BGD），在实际应用中被广泛使用。 缺点：小批量的大小是一个超参数，需要进行调优，如果选择不当，可能会影响算法的性能。


### 应用  
- **线性回归**：用于最小化均方误差（MSE）损失函数，找到最佳的权重和偏置，以拟合数据。 
- **逻辑回归**：通过最小化交叉熵损失函数，进行二分类或多分类任务（只是名字带了回归）。
- **神经网络**：是训练神经网络的基本优化算法。在反向传播算法计算出梯度后，使用梯度下降（或其变体，如 Adam、Adagrad 等改进算法）来更新网络的权重和偏置,以拟合任何函数。



### 5. 代码示例（以线性回归的小批量梯度下降为例） 
```python 
import numpy as np

# 生成一些随机数据
np.random.seed(0)
X = np.random.rand(100, 1)
y = 2 * X + 1 + 0.5 * np.random.randn(100, 1)  # 真实模型加上噪声

# 初始化参数
theta = np.random.rand(1, 1)
learning_rate = 0.01
batch_size = 16
epochs = 100

# 小批量梯度下降
for epoch in range(epochs):
    indices = np.random.permutation(len(X))
    for start in range(0, len(X), batch_size):
        end = start + batch_size
        batch_X = X[indices[start:end]]
        batch_y = y[indices[start:end]]

        # 计算预测值
        y_pred = np.dot(batch_X, theta)

        # 计算梯度
        gradient = np.dot(batch_X.T, (y_pred - batch_y)) / batch_size

        # 更新参数
        theta = theta - learning_rate * gradient

print("最终的参数:", theta)
```

而在现代深度学习框架中，一切都已封装完成，调用一下就好了