import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { of, Subject, tap } from 'rxjs';
import { rxEffects, RxEffectsSetupFn } from './rx-effects';

describe(rxEffects, () => {
  it('should register an observable', () => {
    const spy = jest.fn();
    setupComponent(({ register }) => register(of('src').pipe(tap(spy))));
    expect(spy).toHaveBeenCalledWith('src');
  });

  it('should register an observable and sideEffect fn', () => {
    const spy = jest.fn();
    setupComponent(({ register }) => register(of('src'), spy));
    expect(spy).toHaveBeenCalledWith('src');
  });

  it('should register multiple observables', () => {
    const spy = jest.fn();
    setupComponent(({ register }) => {
      register(of('src').pipe(tap(spy)));
      register(of('src2'), spy);
    });
    expect(spy.mock.calls[0][0]).toEqual('src');
    expect(spy.mock.calls[1][0]).toEqual('src2');
  });

  it('should handle errors', () => {
    const spyNext = jest.fn();
    const spyError = jest.fn();
    const trigger = new Subject();
    setupComponent(({ register }) => {
      register(trigger, spyNext);
      register(trigger, { next: () => void 0, error: spyError });
    });

    expect(spyNext).toHaveBeenCalledTimes(0);
    trigger.next(1);
    expect(spyNext).toHaveBeenCalledTimes(1);
    trigger.error('E');
    expect(spyNext).toHaveBeenCalledTimes(1);
    expect(spyError).toHaveBeenCalledTimes(1);
  });

  it('should call onCleanup', () => {
    const spySideEffect = jest.fn();
    const spyInternalOnCleanup = jest.fn();

    const { fixture, component } = setupComponent(({ register, onCleanup }) => {
      register(of('src').pipe(tap(spySideEffect)));
      onCleanup(spyInternalOnCleanup);
    });
    const spyOnCleanup = jest.fn();
    component.effects.onCleanup(spyOnCleanup);

    expect(spySideEffect).toHaveBeenCalled();
    expect(spyInternalOnCleanup).not.toHaveBeenCalled();
    expect(spyOnCleanup).not.toHaveBeenCalled();
    fixture.destroy();
    expect(spyInternalOnCleanup).toHaveBeenCalled();
    expect(spyOnCleanup).toHaveBeenCalled();
  });
});

function setupComponent<T>(setupFn?: RxEffectsSetupFn<T>) {
  @Component({})
  class TestComponent {
    readonly effects = rxEffects(setupFn);
  }

  TestBed.configureTestingModule({
    declarations: [TestComponent],
  });

  const fixture = TestBed.createComponent(TestComponent);

  return {
    fixture,
    component: fixture.componentInstance,
  };
}