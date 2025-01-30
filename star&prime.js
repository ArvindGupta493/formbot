function pyramid(n){
    for(let i=0; i<n; i++){
      var output='';
      for( let j=0; j < n - i; j++ ) output+= ' ';
      for( let k=0; k <= i ; k++ ) output+= '* ';
      console.log(output)
    }
  }
  pyramid(5)
  
  
  
  
  
  
  let num=[]
  for(let n=5; n<=100; n++){
    let isPrime = true;
    for( i=2; i<Math.sqrt(n); i++){
      if (n % i === 0){
        isPrime = false;
        break
      }
    }
    if (isPrime) num.push(n)
  }
  console.log(num)
  
  
  
  